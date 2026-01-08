import express from "express";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ============================================================
// In-Memory Store (PoC)
// ============================================================
// CallSid → { step }
const tasks = new Map();
// CallSid → { text, hangup }
const answers = new Map();

// ============================================================
// TWILIO → WEBHOOK
// ============================================================
app.post("/twiml", async (req, res) => {
  const callSid = req.body.CallSid;

  if (!callSid) {
    return res.status(400).send("Missing CallSid");
  }

  // neuen Task anlegen oder Step erhöhen
  const current = tasks.get(callSid) ?? { step: 1 };
  tasks.set(callSid, current);

  console.log("📥 Twilio Call:", callSid, "Step:", current.step);

  // auf Antwort vom Agent warten (max. 6s)
  const start = Date.now();
  while (!answers.has(callSid) && Date.now() - start < 6000) {
    await new Promise(r => setTimeout(r, 300));
  }

  const result = answers.get(callSid) ?? {
    text: "Einen Moment bitte.",
    hangup: false
  };

  answers.delete(callSid);

  res.type("text/xml").send(`
<Response>
  <Say voice="alice" language="de-DE">
    ${result.text}
  </Say>
  ${result.hangup
    ? "<Hangup/>"
    : `<Redirect method="POST">/twiml</Redirect>`}
</Response>
`);
});

// ============================================================
// AGENT → WEBHOOK (POLLING)
// ============================================================
app.post("/agent/poll", (req, res) => {
  const next = [...tasks.entries()][0];
  if (!next) {
    return res.status(204).end();
  }

  const [callSid, task] = next;
  tasks.delete(callSid);

  res.json({
    callSid,
    step: task.step
  });
});

// ============================================================
// AGENT → WEBHOOK (ANSWER)
// ============================================================
app.post("/agent/answer", (req, res) => {
  const { callSid, text, hangup } = req.body;

  if (!callSid || !text) {
    return res.status(400).json({ error: "callSid + text required" });
  }

  answers.set(callSid, { text, hangup });

  // Step erhöhen
  const current = tasks.get(callSid) ?? { step: 1 };
  current.step++;
  tasks.set(callSid, current);

  res.json({ ok: true });
});

// ============================================================
// START
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🌐 Twilio Webhook listening on port", PORT);
});
