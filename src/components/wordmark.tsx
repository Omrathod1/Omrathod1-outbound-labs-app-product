/**
 * Text stand-in for the logo until the brand files (public/brand in the
 * website repo) are copied in. Inter Semibold, lower case, tracked -3%,
 * as the brand guide specifies for the wordmark.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold lowercase tracking-[-0.03em] text-ink ${className}`}>outbound labs</span>
  );
}
