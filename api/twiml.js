// Vercel Serverless Function – Twilio Webhook
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Twilio sendet Form-encoded Daten
  const body = req.body || {};

  // Minimal sichere Antwort
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">
    Einen Moment bitte.
  </Say>
</Response>
  `.trim());
}
