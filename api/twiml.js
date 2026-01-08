// api/twiml.js
const callState = new Map(); // CallSid → step

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "demo";
  const step = (callState.get(callSid) || 1);

  // Platzhalter – wird in Schritt 2 vom Agenten ersetzt
  const text =
    step === 1 ? "Guten Tag. Dies ist Schritt eins."
  : step === 2 ? "Dies ist Schritt zwei."
  : "Vielen Dank. Auf Wiederhören.";

  const hangup = step >= 3;

  callState.set(callSid, step + 1);

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">${text}</Say>
  ${hangup ? "<Hangup/>" : `<Redirect method="POST">/api/twiml</Redirect>`}
</Response>
  `.trim());
}
