import React from "react";

interface SpeakerLabelProps {
  speaker: string;
}

const speakerColors: { [key: string]: string } = {};
const colorPalette = [
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-green-100 text-green-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-cyan-100 text-cyan-800",
];

const SpeakerLabel: React.FC<SpeakerLabelProps> = ({ speaker }) => {
  // Assign consistent colors to speakers
  if (!speakerColors[speaker]) {
    const colorIndex = Object.keys(speakerColors).length % colorPalette.length;
    speakerColors[speaker] = colorPalette[colorIndex];
  }

  const speakerIdentifier = speaker.replace(/^Speaker\s*/, "");

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${speakerColors[speaker]}`}
    >
      {speakerIdentifier}
    </span>
  );
};

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}

export function formatTranscript(transcript: string, searchTerm: string = "") {
  if (!transcript) return [];

  const lines = transcript.split("\n").filter((line) => line.trim());
  const filteredLines = searchTerm
    ? lines.filter((line) =>
        line.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : lines;

  return filteredLines
    .map((line, index) => {
      const matchSpeaker = line.match(/^(Speaker\s*[A-Za-z0-9]+):\s*(.+)$/);
      if (!matchSpeaker) return null;

      const [, speaker, text] = matchSpeaker;

      return (
        <div key={index} className="mb-6 last:mb-0">
          <div className="mb-2">
            <SpeakerLabel speaker={speaker.trim()} />
          </div>
          <div className="pl-4 content-text">
            {highlightText(text.trim(), searchTerm)}
          </div>
        </div>
      );
    })
    .filter(Boolean);
}
