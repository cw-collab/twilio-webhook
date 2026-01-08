// api/twiml.js
// Schlanke Twilio-Lösung – kompletter Dialog im Webhook

const callState = new Map(); // CallSid → Step

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "demo";
  const step = callState.get(callSid) || 1;

  // === Dialogskript ===
  const script = [
    "Guten Tag. Hier spricht der KI Voice Agent.",
    "Dies ist ein automatisierter Demo-Anruf über Twilio.",
    "Vielen Dank für Ihre Zeit. Auf Wiederhören."
  ];

  const text = script[step - 1] || script[script.length - 1];
  const hangup = step >= script.length;

  callState.set(callSid, step + 1);

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">${text}</Say>
  ${hangup ? "<Hangup/>" : `<Redirect method="POST">/api/twiml</Redirect>`}
</Response>
  `.trim());
}
