import { Resend } from "resend";

type ListingNotice = {
  title: string;
  locality: string;
  price: number;
  contactName: string;
  contactPhone: string;
};

export function buildListingNotification(listing: ListingNotice) {
  return [
    "מודעה חדשה ממתינה לאישור",
    `${listing.title} · ${listing.locality}`,
    `₪${listing.price.toLocaleString("he-IL")} לחודש`,
    `מפרסם: ${listing.contactName} · ${listing.contactPhone}`,
  ].join("\n");
}

export async function notifyAboutListing(listing: ListingNotice) {
  const message = buildListingNotification(listing);
  const tasks: Promise<unknown>[] = [];

  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL_FROM && process.env.NOTIFICATION_EMAIL_TO) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    tasks.push(resend.emails.send({
      from: process.env.NOTIFICATION_EMAIL_FROM,
      to: process.env.NOTIFICATION_EMAIL_TO,
      subject: `מודעה חדשה: ${listing.title}`,
      text: message,
    }));
  }

  if (process.env.WHATSAPP_WEBHOOK_URL) {
    tasks.push(fetch(process.env.WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    }));
  }

  await Promise.allSettled(tasks);
}
