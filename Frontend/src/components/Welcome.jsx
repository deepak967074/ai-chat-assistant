function Welcome({ sendMessage }) {
  const suggestions = [
    "Build a React frontend",
    "Explain code in Hindi",
    "Create project UI",
    "Fix my error",
  ];

  return (
    <div className="welcome">
      <h1>How can I help you today?</h1>

      <div className="suggestions">
        {suggestions.map((item, index) => (
          <div key={index} onClick={() => sendMessage(item)}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Welcome;
