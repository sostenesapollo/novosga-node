import { useEffect, useState } from "react";

type Props = { searchText: string; content: string };

function HighlightText({ searchText, content }: Props) {
  const highlightText = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-muted-foreground text-muted">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const [result, setResult] = useState(highlightText(content, searchText));

  useEffect(() => {
    setResult(highlightText(content, searchText));
  }, [searchText]);

  return <div className="content">{result}</div>;
}

export default HighlightText;
