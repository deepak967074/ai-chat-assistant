function Sidebar({
  history,
  activeHistory,
  newChat,
  deleteHistory,
  openThread,
}) {
  return (
    <aside className="sidebar">
      <button className="new-chat" onClick={newChat}>
        + New chat
      </button>

      <div className="history">
        <p>Today</p>

        {history.map((item, index) => (
          <div
            key={item.threadId || item.id}
            className={`history-item ${
              activeHistory === (item.threadId || item.id) ? "active" : ""
            }`}
            onClick={() => openThread(item)}
          >
            <span className="history-text">{item.title}</span>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteHistory(item.threadId || item.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="side-bottom">
        <div>⚙ Settings</div>
        <div className="user">Deepak</div>
      </div>
    </aside>
  );
}

export default Sidebar;
