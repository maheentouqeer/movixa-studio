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

async function sendMail(opts: {
  lovableKey: string;
  gmailKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}) {
  const rfc = [
    `To: ${opts.to}`,
    `From: ${opts.from}`,
    ...(opts.replyTo ? [`Reply-To: ${opts.replyTo}`] : []),
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    opts.html,
  ].join("\r\n");

  const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.lovableKey}`,
      "X-Connection-Api-Key": opts.gmailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: b64url(rfc) }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gmail send failed: ${res.status} ${t}`);
  }
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
    const owner = profile.emailAddress;

    // ---------- 1) Notification to owner ----------
    const subject = `New Movixa inquiry — ${data.full_name}${data.company_name ? ` (${data.company_name})` : ""}`;

    const ownerHtml = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:32px;">
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

    await sendMail({
      lovableKey: LOVABLE_API_KEY,
      gmailKey: GOOGLE_MAIL_API_KEY,
      from: `Movixa Studio <${owner}>`,
      to: owner,
      replyTo: `${data.full_name} <${data.email}>`,
      subject,
      html: ownerHtml,
    });

    // ---------- 2) Confirmation to client ----------
    const clientHtml = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0a0a0a;color:#e5e5e5;padding:32px;">
<div style="max-width:600px;margin:0 auto;background:#111;border:1px solid #222;border-radius:16px;padding:40px;">
  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#e0a06a;">Movixa Studio</div>
  <h1 style="margin:12px 0 8px;font-size:28px;color:#fff;font-family:'Instrument Serif',Georgia,serif;">Your brief just landed.</h1>
  <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#bbb;">
    Thank you, ${esc(data.full_name)}. We received your project inquiry and our team is reviewing it now.
    You'll hear back from us within one business day with a clear next step.
  </p>
  <div style="margin:32px 0;padding:20px;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:12px;">
    <div style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">What you sent</div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${[
        ["Service", data.service_required],
        ["Budget", data.estimated_budget],
        ["Timeline", data.project_timeline],
      ]
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 0;color:#888;width:100px;">${k}</td><td style="padding:6px 0;color:#fff;">${esc(v as string)}</td></tr>`,
        )
        .join("")}
    </table>
  </div>
  <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#888;">
    In the meantime, feel free to reply to this email with anything else — references, mood, deadlines. The more you share, the sharper our first proposal.
  </p>
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid #222;color:#666;font-size:12px;">
    Movixa — Cinematic AI Creative Studio<br>
    <a style="color:#e0a06a;text-decoration:none;" href="https://movixa-studio.lovable.app">movixa-studio.lovable.app</a>
  </div>
</div></body></html>`;

    // Client confirmation is best-effort; don't fail the whole call if it errors
    try {
      await sendMail({
        lovableKey: LOVABLE_API_KEY,
        gmailKey: GOOGLE_MAIL_API_KEY,
        from: `Movixa Studio <${owner}>`,
        to: `${data.full_name} <${data.email}>`,
        replyTo: owner,
        subject: "We received your Movixa brief",
        html: clientHtml,
      });
    } catch (err) {
      console.error("Client confirmation email failed", err);
    }

    return { ok: true };
  });
