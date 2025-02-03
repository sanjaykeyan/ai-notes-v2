import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

export const TypeWriter = ({
  text,
  delay = 10,
  onComplete,
}: TypeWriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const getRandomDelay = (char: string) => {
    // Longer pause after punctuation
    if (/[.,!?]/.test(char)) {
      return Math.random() * 50 + 40; // Decreased from 70+50 to 50+40
    }
    // Medium pause after spaces
    if (char === ' ') {
      return Math.random() * 25 + 15; // Decreased from 30+20 to 25+15
    }
    // Variable typing speed for regular characters
    return Math.random() * 12 + 12; // Changed from 15+15 to 12+12 for max 24ms delay
  };

  useEffect(() => {
    if (currentIndex < text.length) {
      const currentChar = text[currentIndex];
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + currentChar);
        setCurrentIndex((prev) => prev + 1);
      }, getRandomDelay(currentChar));

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span className="relative min-h-[20px] inline-block">
      {currentText}
      <span className="absolute -right-[2px] top-1 w-[2px] h-[14px] bg-blue-400 animate-[blink_1s_ease-in-out_infinite]" />
    </span>
  );
};
