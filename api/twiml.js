// ============================================================
// TwiML Handler - FIXED for Bidirectional Audio
// ============================================================
// Deploy to: Vercel (api/twiml.js)
// ============================================================

const AGENT_WS = "wss://twilio-gw.cw-voice-agent-demo.de/twilio-media";

export default async function handler(req, res) {
  // Allow GET for testing, POST for Twilio
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const callSid = req.body?.CallSid || "test";
  console.log(`📞 TwiML request for CallSid: ${callSid}`);

  res.setHeader("Content-Type", "text/xml");

  // ✅ FIXED: Bidirectional Stream Configuration
  // - NO track attribute = bidirectional by default
  // - Twilio sends audio TO us AND plays audio FROM us
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Vicki" language="de-DE">Einen Moment bitte, ich verbinde Sie mit dem Assistenten.</Say>
  <Connect>
    <Stream url="${AGENT_WS}" />
  </Connect>
  <Say voice="Polly.Vicki" language="de-DE">Die Verbindung wurde beendet. Auf Wiederhören.</Say>
</Response>`);
}