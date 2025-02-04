import React, { useState } from "react";

interface SpeakerLabelProps {
  speaker: string;
  meetingId: string;
  customNames: Record<string, string>;
  onSpeakerUpdate: (original: string, custom: string) => void;
}

const speakerColors: { [key: string]: string } = {};
const colorPalette = [
  "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100",
  "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100",
  "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
  "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100",
  "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-100",
  "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-100",
];

const SpeakerLabel: React.FC<SpeakerLabelProps> = ({
  speaker,
  meetingId,
  customNames,
  onSpeakerUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(
    customNames[speaker] || speaker.replace(/^Speaker\s*/, "")
  );

  if (!speakerColors[speaker]) {
    const colorIndex = Object.keys(speakerColors).length % colorPalette.length;
    speakerColors[speaker] = colorPalette[colorIndex];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onSpeakerUpdate(speaker, customName);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="inline-block">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="px-2.5 py-0.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          onBlur={handleSubmit}
        />
      </form>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${speakerColors[speaker]} cursor-pointer hover:opacity-80`}
    >
      {customNames[speaker] || speaker.replace(/^Speaker\s*/, "")}
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

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatTranscript(
  transcript: string,
  searchTerm: string = "",
  meetingId: string,
  customNames: Record<string, string> = {},
  onSpeakerUpdate: (original: string, custom: string) => void,
  startTime?: number
) {
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
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <SpeakerLabel
                speaker={speaker.trim()}
                meetingId={meetingId}
                customNames={customNames}
                onSpeakerUpdate={onSpeakerUpdate}
              />
              {startTime !== undefined && (
                <span className="text-[13px] font-mono text-indigo-600 dark:text-indigo-400 font-medium opacity-75">
                  {formatTime(startTime)}
                </span>
              )}
            </div>
          </div>
          <div className="pl-4 text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
            {highlightText(text.trim(), searchTerm)}
          </div>
        </div>
      );
    })
    .filter(Boolean);
}
