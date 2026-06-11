import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/geminiAi.js";

const router = express.Router();

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.json(thread.messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch chat" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    return res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.slice(0, 40),
        messages: [],
      });
    }

    thread.messages.push({
      role: "user",
      content: message,
    });
    // console.log("THREAD MESSAGES:");
    // console.log(JSON.stringify(thread.messages, null, 2));

    const assistantReply = await getGeminiAPIResponse(thread.messages);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    await thread.save();

    return res.json({
      reply: assistantReply,
      threadId: thread.threadId,
    });
  } catch (err) {
    console.log("Gemini/API Error:", err.status, err.message);

    if (err.status === 429) {
      return res.status(429).json({
        error:
          "Gemini quota khatam hai. Thodi der baad try karo ya dusri API key use karo.",
      });
    }

    if (err.status === 503) {
      return res.status(503).json({
        error: "Gemini abhi busy hai. Thodi der baad try karo.",
      });
    }

    return res.status(500).json({
      error: "Server me problem aa gayi.",
    });
  }
});

export default router;