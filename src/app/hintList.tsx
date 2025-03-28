'use client';

interface HintListProps {
  hints: string[];
}

export default function HintList({ hints }: HintListProps) {
  return (
    <div className="mb-6 border rounded p-4 h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Hints</h2>
      {hints.length === 0 ? (
        <p className="text-gray-400 italic">No hints yet, try guessing.</p>
      ) : (
        <ul className="bg-gray-100 text-center p-2 rounded">
          {hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
