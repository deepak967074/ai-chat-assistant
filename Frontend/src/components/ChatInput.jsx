function ChatInput({ message, setMessage, sendMessage, loading }) {
  return (
    <div className="input-area">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Message AI Chat Assistant..."
        disabled={loading}
      />

      <button onClick={() => sendMessage()} disabled={loading}>
        {loading ? "…" : "➤"}
      </button>
    </div>
  );
}

export default ChatInput;
