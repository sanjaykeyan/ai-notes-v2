import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

export const TypeWriter = ({
  text,
  delay = 15,
  onComplete,
}: TypeWriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return (
    <span className="relative min-h-[20px] inline-block">
      {currentText}
      <span className="absolute -right-[2px] top-1 w-[2px] h-[14px] bg-gray-400 animate-[blink_1s_ease-in-out_infinite]" />
    </span>
  );
};
