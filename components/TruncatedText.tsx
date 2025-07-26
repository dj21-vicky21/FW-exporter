"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TruncatedTextProps {
  text: string;
  maxLines?: number;
}

export function TruncatedText({ text, maxLines = 3 }: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = text.split('\n');
  const isLong = lines.length > maxLines;

  if (!isLong) return <div className="whitespace-pre-wrap">{text}</div>;

  return (
    <div>
      <div
        className={`whitespace-pre-wrap ${
          !isExpanded ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </div>
      <Button
        variant="link"
        className="p-0 h-auto font-medium"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
} 