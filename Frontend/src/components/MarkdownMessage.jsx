import ReactMarkdown from "react-markdown";

function MarkdownMessage({ content }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}

export default MarkdownMessage;
