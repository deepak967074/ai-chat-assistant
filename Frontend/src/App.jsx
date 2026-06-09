import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Welcome from "./components/Welcome";
import Messages from "./components/Messages";
import ChatInput from "./components/ChatInput";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [threadId, setThreadId] = useState(Date.now().toString());
  const [history, setHistory] = useState([]);
  const [activeHistory, setActiveHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text = message) => {
    if (!text.trim() || loading) return;

    const userText = text;
    const historyId = Date.now().toString();

    setActiveHistory(historyId);
    setHistory((prev) => [{ id: historyId, title: userText }, ...prev]);
    setChat((prev) => [...prev, { role: "user", content: userText }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/chat", {
        threadId,
        message: userText,
      });

      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply || "Reply nahi aaya" },
      ]);
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

  const fetchThreads = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/thread");
      setHistory(res.data);
    } catch (error) {
      console.log("Failed to load history", error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const openThread = async (item) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/thread/${item.threadId}`,
      );

      setChat(res.data);
      setThreadId(item.threadId);
      setActiveHistory(item.threadId);
    } catch (error) {
      console.log("Failed to open chat", error);
    }
  };

  const newChat = () => {
    setChat([]);
    setMessage("");
    setActiveHistory(null);
    setThreadId(Date.now().toString());
    setLoading(false);
  };

  const deleteHistory = async (threadId) => {
    try {
      await axios.delete(`http://localhost:8080/api/thread/${threadId}`);

      setHistory((prev) => prev.filter((item) => item.threadId !== threadId));

      if (activeHistory === threadId) {
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
