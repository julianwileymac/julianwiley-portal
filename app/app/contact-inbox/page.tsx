import { notFound } from "next/navigation";
import { getAccess } from "@/lib/access";
import { ContactInboxContent } from "@/components/admin/ContactInboxContent";

export default async function ContactInboxPage() {
  const access = await getAccess();
  if (!access.can.viewContactInbox) notFound();
  return <ContactInboxContent />;
}
