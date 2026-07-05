import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const schema = z.object({
  full_name: z.string().min(1).max(200),
  company_name: z.string().max(200).optional().nullable(),
  email: z.string().email().max(255),
  phone: z.string().max(60).optional().nullable(),
  country: z.string().max(120),
  website: z.string().max(500).optional().nullable(),
  service_required: z.string().max(200).optional().nullable(),
  estimated_budget: z.string().max(200).optional().nullable(),
  project_timeline: z.string().max(200).optional().nullable(),
  project_description: z.string().max(6000).optional().nullable(),
});

function b64url(input: string): string {
  const b64 = Buffer.from(input, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function esc(v: string | null | undefined): string {
  if (!v) return "—";
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const notifyInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const GOOGLE_MAIL_API_KEY = process.env.GOOGLE_MAIL_API_KEY;
    if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
      throw new Error("Email not configured");
    }

    // Fetch owner email address (send to self)
    const profileRes = await fetch(`${GATEWAY_URL}/users/me/profile`, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
      },
    });
    if (!profileRes.ok) {
      throw new Error(`Gmail profile fetch failed: ${profileRes.status}`);
    }
    const profile = (await profileRes.json()) as { emailAddress: string };
    const to = profile.emailAddress;

    const subject = `New Movixa inquiry — ${data.full_name}${data.company_name ? ` (${data.company_name})` : ""}`;

    const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:32px;">
<div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #222;border-radius:16px;padding:32px;">
  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#e0a06a;">Movixa · New Inquiry</div>
  <h1 style="margin:8px 0 24px;font-size:24px;color:#fff;">${esc(data.full_name)}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${[
      ["Company", data.company_name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Country", data.country],
      ["Website", data.website],
      ["Service", data.service_required],
      ["Budget", data.estimated_budget],
      ["Timeline", data.project_timeline],
    ]
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 0;color:#888;width:120px;">${k}</td><td style="padding:8px 0;color:#fff;">${esc(v as string | null | undefined)}</td></tr>`,
      )
      .join("")}
  </table>
  ${
    data.project_description
      ? `<div style="margin-top:24px;padding-top:24px;border-top:1px solid #222;">
    <div style="color:#888;font-size:12px;margin-bottom:8px;">PROJECT DESCRIPTION</div>
    <div style="color:#fff;font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(data.project_description)}</div>
  </div>`
      : ""
  }
  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #222;color:#666;font-size:12px;">Reply directly to <a style="color:#e0a06a;" href="mailto:${esc(data.email)}">${esc(data.email)}</a></div>
</div></body></html>`;

    const rfc = [
      `To: ${to}`,
      `From: ${to}`,
      `Reply-To: ${data.full_name} <${data.email}>`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html,
    ].join("\r\n");

    const sendRes = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: b64url(rfc) }),
    });
    if (!sendRes.ok) {
      const t = await sendRes.text();
      throw new Error(`Gmail send failed: ${sendRes.status} ${t}`);
    }
    return { ok: true };
  });
