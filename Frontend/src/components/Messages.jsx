import MarkdownMessage from "./MarkdownMessage";

function Messages({ chat, loading }) {
  return (
    <div className="messages">
      {chat.map((msg, index) => (
        <div
          key={index}
          className={`message-row ${
            msg.role === "user" ? "user-row" : "assistant-row"
          }`}
        >
          <div
            className={`message-box ${
              msg.role === "user" ? "user-box" : "assistant-box"
            }`}
          >
            {msg.role === "assistant" ? (
              <MarkdownMessage content={msg.content} />
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="message-row assistant-row">
          <div className="message-box assistant-box typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
