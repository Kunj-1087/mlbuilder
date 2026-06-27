import { http, HttpResponse } from "msw";
import fs from "fs";
import path from "path";

export interface MockedEmail {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from: string;
}

export interface MockedEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
}

const EMAILS_FILE = path.resolve(process.cwd(), "tests/mocks/temp_emails.json");
const EVENTS_FILE = path.resolve(process.cwd(), "tests/mocks/temp_events.json");

let mockedEmails: MockedEmail[] = [];
let mockedEvents: MockedEvent[] = [];

// Helper functions to persist logs on disk
function writeEmails(emails: MockedEmail[]) {
  try {
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
  } catch (e) {}
}

function writeEvents(events: MockedEvent[]) {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  } catch (e) {}
}

export const handlers = [
  // Intercept Resend API email delivery
  http.post("https://api.resend.com/emails", async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      const email = {
        to: body.to,
        subject: body.subject,
        html: body.html || "",
        text: body.text || "",
        from: body.from || "",
      };
      
      const current = getMockedEmails();
      current.push(email);
      writeEmails(current);
    } catch (e) {}

    return HttpResponse.json({ id: `mocked-email-${Date.now()}` }, { status: 200 });
  }),

  // Intercept PostHog capture endpoints
  http.post("https://*.i.posthog.com/capture", async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      if (body) {
        const events = getMockedEvents();
        if (body.batch) {
          body.batch.forEach((e: any) => {
            events.push({
              event: e.event,
              properties: e.properties || {},
              timestamp: e.timestamp || new Date().toISOString(),
            });
          });
        } else if (body.event) {
          events.push({
            event: body.event,
            properties: body.properties || {},
            timestamp: body.timestamp || new Date().toISOString(),
          });
        }
        writeEvents(events);
      }
    } catch (e) {}
    return HttpResponse.json({ status: 1 }, { status: 200 });
  }),

  http.post("https://us.i.posthog.com/capture", async ({ request }) => {
    try {
      const body = (await request.json()) as any;
      if (body) {
        const events = getMockedEvents();
        if (body.batch) {
          body.batch.forEach((e: any) => {
            events.push({
              event: e.event,
              properties: e.properties || {},
              timestamp: e.timestamp || new Date().toISOString(),
            });
          });
        } else if (body.event) {
          events.push({
            event: body.event,
            properties: body.properties || {},
            timestamp: body.timestamp || new Date().toISOString(),
          });
        }
        writeEvents(events);
      }
    } catch (e) {}
    return HttpResponse.json({ status: 1 }, { status: 200 });
  }),
];

export function getMockedEmails(): MockedEmail[] {
  try {
    if (fs.existsSync(EMAILS_FILE)) {
      return JSON.parse(fs.readFileSync(EMAILS_FILE, "utf-8")) as MockedEmail[];
    }
  } catch {}
  return mockedEmails;
}

export function getMockedEvents(): MockedEvent[] {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      return JSON.parse(fs.readFileSync(EVENTS_FILE, "utf-8")) as MockedEvent[];
    }
  } catch {}
  return mockedEvents;
}

export function clearMockedHistory() {
  mockedEmails = [];
  mockedEvents = [];
  try {
    if (fs.existsSync(EMAILS_FILE)) fs.unlinkSync(EMAILS_FILE);
  } catch {}
  try {
    if (fs.existsSync(EVENTS_FILE)) fs.unlinkSync(EVENTS_FILE);
  } catch {}
}
