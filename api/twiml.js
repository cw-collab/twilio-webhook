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

  res.status(200).send(`
<Response>
  <Connect>
    <Stream
      url="wss://twilio-gw.cw-voice-agent-demo.de/twilio-media"
      track="inbound"
    />
  </Connect>
</Response>`.trim());
}
