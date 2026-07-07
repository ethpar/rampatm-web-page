// AWS Lambda handler for a website contact form, sending via SMTP.
// Runtime: Node.js 20.x
// Requires "nodemailer" bundled with your deployment package:
//
//   mkdir contact-lambda && cd contact-lambda
//   npm init -y
//   npm install nodemailer
//   cp index.mjs .
//   zip -r function.zip .
//   # upload function.zip to Lambda
//
// Env vars to set on the Lambda function:
//   CREDENTIALS_EMAIL   JSON string matching the EmailCredentials type:
//                       {"auth":true,"host":"smtp.example.com","port":"587",
//                        "password":"...","protocol":"smtp","username":"...",
//                        "sslProtocols":"TLSv1.2","starttlsEnable":true}
//   MAIL_FROM           address to send from, e.g. "noreply@yourdomain.com"
//   MAIL_TO             your internal inbox address
//   ALLOWED_ORIGIN      your website origin, e.g. "https://www.yourdomain.com"

import nodemailer from "nodemailer";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function respond(statusCode, bodyObj) {
  return {
    statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj),
  };
}

function validate({ name, contact, notes }) {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return "Name is required.";
  }
  if (!contact || typeof contact !== "string" || contact.trim().length === 0) {
    return "Contact info is required.";
  }
  if (!notes || typeof notes !== "string" || notes.trim().length === 0) {
    return "A message is required.";
  }
  if (name.length > 200 || contact.length > 200 || notes.length > 5000) {
    return "One or more fields are too long.";
  }
  return null;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Parse the credentials JSON once per cold start.
let credentials;
function getCredentials() {
  if (credentials) return credentials;

  const raw = process.env.CREDENTIALS_EMAIL;
  if (!raw) {
    throw new Error("CREDENTIALS_EMAIL env var is not set.");
  }

  try {
    credentials = JSON.parse(raw);
  } catch (err) {
    throw new Error("CREDENTIALS_EMAIL env var is not valid JSON.");
  }

  return credentials;
}

// Build the transporter once per cold start and reuse across warm invocations.
let transporter;
function getTransporter() {
  if (transporter) return transporter;

  const creds = getCredentials();
  const port = Number(creds.port);
  const starttls = Boolean(creds.starttlsEnable);

  transporter = nodemailer.createTransport({
    host: creds.host,
    port,
    // Port 465 is implicit TLS; STARTTLS ports (e.g. 587) should have secure:false
    // and let STARTTLS upgrade the plain connection.
    secure: port === 465 && !starttls,
    requireTLS: starttls,
    auth: creds.auth
      ? { user: creds.username, pass: creds.password }
      : undefined,
    tls: creds.sslProtocols ? { minVersion: creds.sslProtocols } : undefined,
  });

  return transporter;
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return respond(200, { ok: true });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body." });
  }

  // Honeypot: hidden form field real users never fill in.
  if (payload.website) {
    return respond(200, { ok: true });
  }

  const error = validate(payload);
  if (error) {
    return respond(400, { error });
  }

  const { name, contact, notes } = payload;

  try {
    const creds = getCredentials();
    const mailer = getTransporter();
    await mailer.sendMail({
      from: creds.username,
      to: process.env.MAIL_TO,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nContact: ${contact}\n\nMessage:\n${notes}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
<p><strong>Message:</strong><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>`,
    });

    return respond(200, { ok: true });
  } catch (err) {
    console.error("SMTP send failed:", err);
    return respond(500, { error: "Failed to send message. Please try again later." });
  }
};
