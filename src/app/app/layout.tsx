import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { signOut } from "./actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-4 sm:px-8">
        <Link href="/app" aria-label="Outbound Labs home">
          <Wordmark className="text-lg" />
        </Link>
        <form action={signOut}>
          <button type="submit" className="rounded-[10px] px-3 py-1.5 text-sm text-soft hover:text-ink">
            Sign out
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
