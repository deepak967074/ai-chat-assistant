import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Welcome from "./components/Welcome";
import Messages from "./components/Messages";
import ChatInput from "./components/ChatInput";

const API_URL = "https://ai-chat-assistant-482r.onrender.com/api";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [threadId, setThreadId] = useState(Date.now().toString());
  const [history, setHistory] = useState([]);
  const [activeHistory, setActiveHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchThreads = async () => {
    try {
      const res = await axios.get(`${API_URL}/thread`);
      setHistory(res.data);
    } catch (error) {
      console.log("Failed to load history", error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const sendMessage = async (text = message) => {
    if (!text.trim() || loading) return;

    const userText = text.trim();

    setChat((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        threadId,
        message: userText,
      });

      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply || "Reply nahi aaya",
        },
      ]);

      setActiveHistory(threadId);
      fetchThreads();
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.error || "Backend se response nahi aaya",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (item) => {
    try {
      const res = await axios.get(`${API_URL}/thread/${item.threadId}`);

      setChat(res.data);
      setThreadId(item.threadId);
      setActiveHistory(item.threadId);
      setMessage("");
      setLoading(false);
    } catch (error) {
      console.log("Failed to open chat", error);
    }
  };

  const newChat = () => {
    const newThreadId = Date.now().toString();

    setThreadId(newThreadId);
    setChat([]);
    setMessage("");
    setActiveHistory(null);
    setLoading(false);
  };

  const deleteHistory = async (id) => {
    try {
      await axios.delete(`${API_URL}/thread/${id}`);

      setHistory((prev) => prev.filter((item) => item.threadId !== id));

      if (activeHistory === id || threadId === id) {
        newChat();
      }
    } catch (error) {
      console.log("Failed to delete chat", error);
    }
  };

  return (
    <div className="app">
      <Sidebar
        history={history}
        activeHistory={activeHistory}
        newChat={newChat}
        deleteHistory={deleteHistory}
        openThread={openThread}
      />

      <main className="main">
        <Topbar />

        {chat.length === 0 ? (
          <Welcome sendMessage={sendMessage} />
        ) : (
          <Messages chat={chat} loading={loading} />
        )}

        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
