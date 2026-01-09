const BASE_URL = "https://twilio-webhook-nine.vercel.app";
const AGENT_WS = "wss://twilio-gw.cw-voice-agent-demo.de/twilio-media";

const callState = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "demo";
  const step = callState.get(callSid) || 1;

  res.setHeader("Content-Type", "text/xml");

  if (step === 1) {
    callState.set(callSid, 2);
    res.status(200).send(`
<Response>
  <Say voice="alice" language="de-DE">
    Ich verbinde Sie jetzt mit unserem KI Agenten.
  </Say>
  <Redirect method="POST">${BASE_URL}/api/twiml</Redirect>
</Response>`.trim());
    return;
  }

  // ✅ FIXED: Added proper Stream configuration
  // - track="inbound_track" ensures we receive caller audio
  // - The WebSocket connection is bidirectional by default
  //   so we can send audio back through the same connection
  res.status(200).send(`
<Response>
  <Connect>
    <Stream url="${AGENT_WS}">
      <Parameter name="track" value="inbound_track"/>
    </Stream>
  </Connect>
  <Say voice="alice" language="de-DE">
    Die Verbindung wurde unterbrochen. Auf Wiederhören.
  </Say>
</Response>`.trim());
}