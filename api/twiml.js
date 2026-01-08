// api/twiml.js
// Schritt 1 FINAL – Call bleibt garantiert offen

const BASE_URL = "https://twilio-webhook-nine.vercel.app";
const callState = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "demo";
  const step = callState.get(callSid) || 1;

  res.setHeader("Content-Type", "text/xml");

  // STEP 1 – Begrüßung
  if (step === 1) {
    callState.set(callSid, 2);

    res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">
    Guten Tag. Ich verbinde Sie jetzt mit unserem KI Agenten.
  </Say>
  <Redirect method="POST">${BASE_URL}/api/twiml</Redirect>
</Response>
    `.trim());
    return;
  }

  // STEP 2 – Call offen halten (Endlosschleife)
  res.status(200).send(`
<Response>
  <Pause length="10"/>
  <Redirect method="POST">${BASE_URL}/api/twiml</Redirect>
</Response>
  `.trim());
}
