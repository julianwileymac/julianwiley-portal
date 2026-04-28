import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "name, email, and message are required" },
      { status: 422 }
    );
  }

  // Phase 1 stub: log to server console. Phase 3 will forward to the
  // FastAPI management backend in rpi_kubernetes for real email delivery.
  // eslint-disable-next-line no-console
  console.log("[contact-form]", {
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ accepted: true }, { status: 202 });
}
