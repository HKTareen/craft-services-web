export function SprayIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      {/* Spray mist */}
      <circle cx="21.5" cy="7" r="1.1" opacity="0.45" />
      <circle cx="20" cy="9.5" r="0.9" opacity="0.6" />
      <circle cx="22" cy="10.5" r="0.75" opacity="0.55" />
      <circle cx="21" cy="12.5" r="0.85" opacity="0.5" />
      <circle cx="19" cy="11.5" r="0.65" opacity="0.4" />

      {/* Nozzle */}
      <path d="M16.5 10.5h3.5v2.2c0 .5-.4.9-.9.9h-1.7c-.5 0-.9-.4-.9-.9v-2.2z" />

      {/* Gun body */}
      <path d="M10.5 9.8h6.5c.6 0 1.1.5 1.1 1.1v3.2c0 .6-.5 1.1-1.1 1.1h-6.5c-.8 0-1.4-.6-1.4-1.4v-2.6c0-.8.6-1.4 1.4-1.4z" />

      {/* Handle */}
      <path d="M8.2 13.8h2.9c.5 0 .9.4.9.9v4.1c0 .5-.4.9-.9.9H9.1c-.5 0-.9-.4-.9-.9v-4.1c0-.5.4-.9.9-.9z" />

      {/* Trigger guard */}
      <path
        d="M9.8 13.2h1.4v2.4H9.8z"
        opacity="0.35"
      />

      {/* Paint cup on top */}
      <path d="M12.2 5.8h3.2c.5 0 .9.4.9.9v2.4c0 .5-.4.9-.9.9h-3.2c-.5 0-.9-.4-.9-.9V6.7c0-.5.4-.9.9-.9z" />
      <path d="M11.6 5.2h4.4c.3 0 .6.3.6.6v.4h-5.6v-.4c0-.3.3-.6.6-.6z" />
    </svg>
  );
}
