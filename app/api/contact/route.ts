import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ForwardEnvelope {
  source: "julianwiley-portal";
  receivedAt: string;
  ip?: string | null;
  userAgent?: string | null;
  payload: Required<Pick<ContactPayload, "name" | "email" | "message">> & {
    subject?: string;
  };
}

/** Discord-style webhooks expect `content`; emit a payload that works for both. */
function buildForwardBody(envelope: ForwardEnvelope): string {
  const summary =
    `New portal contact submission\n` +
    `From: ${envelope.payload.name} <${envelope.payload.email}>\n` +
    (envelope.payload.subject ? `Subject: ${envelope.payload.subject}\n` : "") +
    `\n${envelope.payload.message}`;

  return JSON.stringify({
    content: summary,
    embeds: [
      {
        title: envelope.payload.subject ?? "Contact form submission",
        description: envelope.payload.message,
        author: {
          name: `${envelope.payload.name} <${envelope.payload.email}>`,
        },
        timestamp: envelope.receivedAt,
      },
    ],
    // Plain envelope for non-Discord webhooks (FastAPI, etc.) that prefer
    // structured fields over a `content` string.
    envelope,
  });
}

async function forwardSubmission(envelope: ForwardEnvelope): Promise<{ ok: boolean; status: number; body?: string }> {
  const url = process.env.CONTACT_FORWARD_URL;
  if (!url) {
    // eslint-disable-next-line no-console
    console.log("[contact-form]", envelope);
    return { ok: true, status: 202 };
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.CONTACT_FORWARD_TOKEN) {
    headers["authorization"] = `Bearer ${process.env.CONTACT_FORWARD_TOKEN}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: buildForwardBody(envelope),
      // 5s ceiling — the user is waiting on this and the form re-submits cleanly on failure.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, status: res.status, body: body.slice(0, 200) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 502, body: err instanceof Error ? err.message : String(err) };
  }
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "name, email, and message are required" },
      { status: 422 },
    );
  }

  // Trivial rate-limit hint (sized to the average message). Bigger payloads
  // are almost certainly bots or paste accidents.
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "message too long (5000 chars max)" },
      { status: 413 },
    );
  }

  const envelope: ForwardEnvelope = {
    source: "julianwiley-portal",
    receivedAt: new Date().toISOString(),
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
    payload: {
      name,
      email,
      subject: body.subject?.trim() || undefined,
      message,
    },
  };

  const result = await forwardSubmission(envelope);
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error("[contact-form] forward failed", result);
    return NextResponse.json(
      { error: "Could not forward submission. Please email me directly at julian@julianwiley.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ accepted: true }, { status: 202 });
}
