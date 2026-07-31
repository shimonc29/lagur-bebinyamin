import { Resend } from "resend";

type ListingNotice = {
  id?: string;
  title: string;
  locality: string;
  propertyType?: string;
  rooms?: number;
  price: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
};

type AlertNotice = {
  id?: string;
  localities: readonly string[];
  minRooms: number;
  maxPrice: number;
  name: string;
  phone: string;
};

function webhookUrl() {
  return process.env.LEADS_WEBHOOK_URL || process.env.WHATSAPP_WEBHOOK_URL;
}

async function sendWebhook(payload: object) {
  const url = webhookUrl();
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

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
  const tasks: Promise<unknown>[] = [sendWebhook({
    event: "listing.created",
    source: "lagur-bebinyamin",
    createdAt: new Date().toISOString(),
    lead: {
      id: listing.id,
      type: "listing",
      name: listing.contactName,
      phone: listing.contactPhone,
      email: listing.contactEmail,
    },
    listing: {
      title: listing.title,
      locality: listing.locality,
      propertyType: listing.propertyType,
      rooms: listing.rooms,
      price: listing.price,
    },
    message,
  })];

  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL_FROM && process.env.NOTIFICATION_EMAIL_TO) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    tasks.push(resend.emails.send({
      from: process.env.NOTIFICATION_EMAIL_FROM,
      to: process.env.NOTIFICATION_EMAIL_TO,
      subject: `מודעה חדשה: ${listing.title}`,
      text: message,
    }));
  }

  await Promise.allSettled(tasks);
}

export async function notifyAboutSearchRequest(alert: AlertNotice) {
  const message = [
    "בקשת התראה חדשה",
    `${alert.name} · ${alert.phone}`,
    `יישובים: ${alert.localities.join(", ")}`,
    `מ-${alert.minRooms} חדרים · עד ₪${alert.maxPrice.toLocaleString("he-IL")}`,
  ].join("\n");

  await Promise.allSettled([
    sendWebhook({
      event: "alert.created",
      source: "lagur-bebinyamin",
      createdAt: new Date().toISOString(),
      lead: { id: alert.id, type: "alert", name: alert.name, phone: alert.phone },
      alert: { localities: alert.localities, minRooms: alert.minRooms, maxPrice: alert.maxPrice },
      message,
    }),
  ]);
}
