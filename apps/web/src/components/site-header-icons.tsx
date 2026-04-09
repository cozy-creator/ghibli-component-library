import { BookOpen } from "lucide-react";

export const mockHeaderAvatarUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f4d28b" />
        <stop offset="100%" stop-color="#dca96c" />
      </linearGradient>
    </defs>
    <rect width="80" height="80" rx="18" fill="url(#bg)" />
    <circle cx="40" cy="31" r="16" fill="#f8e7c8" />
    <path d="M17 74c4-16 16-24 23-24s19 8 23 24" fill="#6c7f57" />
    <path d="M26 28c4-9 10-14 18-14 7 0 12 3 16 9-5 5-11 8-19 8-5 0-10-1-15-3z" fill="#4a3627" />
    <circle cx="34" cy="32" r="1.6" fill="#4a3627" />
    <circle cx="46" cy="32" r="1.6" fill="#4a3627" />
    <path d="M35 39c2 2 8 2 10 0" fill="none" stroke="#8a5b44" stroke-linecap="round" stroke-width="2" />
  </svg>
`)}`;

export function GitHubHeaderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 fill-[#181717]"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function DocsHeaderIcon() {
  return (
    <BookOpen
      aria-hidden="true"
      className="size-5 text-[#5865F2]"
      strokeWidth={2.1}
    />
  );
}
