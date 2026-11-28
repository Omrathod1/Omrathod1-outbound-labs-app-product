import { Wordmark } from "@/components/wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="rise-in w-full max-w-sm">
        <Wordmark className="text-xl" />
        {children}
      </div>
    </main>
  );
}
