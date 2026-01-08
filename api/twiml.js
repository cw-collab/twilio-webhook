// api/twiml.js
// Schritt 1: Übergabe an Agent Core (Twilio Media Stream)

const callState = new Map(); // CallSid → Step

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "demo";
  const step = callState.get(callSid) || 1;

  res.setHeader("Content-Type", "text/xml");

  // STEP 1: Begrüßung (Twilio spricht selbst)
  if (step === 1) {
    callState.set(callSid, 2);

    res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">
    Guten Tag. Ich verbinde Sie jetzt mit unserem KI Agenten.
  </Say>
  <Redirect method="POST">/api/twiml</Redirect>
</Response>
    `.trim());
    return;
  }

  // STEP 2: Übergabe an Agent Core (Live Audio)
  res.status(200).send(`
<Response>
  <Connect>
    <Stream url="wss://localhost:8081/twilio-media" />
  </Connect>
</Response>
  `.trim());
}
