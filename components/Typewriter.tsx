"use client";

export function Typewriter({ text }: { text: string }) {
  return (
    <div className="mt-6 relative">
      <span className="type-text">{text}</span>
      <span className="type-caret" aria-hidden="true" />
    </div>
  );
}
