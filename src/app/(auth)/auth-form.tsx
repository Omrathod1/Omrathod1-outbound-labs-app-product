"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/lib/safe-next";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "w-full rounded-[10px] border border-hairline bg-transparent px-3 py-2.5 text-ink placeholder:text-dim focus:border-sky focus:outline-none";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const { error } =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name: String(form.get("name")) })
        : await authClient.signIn.email({ email, password });

    setPending(false);
    if (error) {
      setError(
        mode === "sign-up"
          ? error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ? "An account with this email already exists. Sign in instead."
            : "We couldn't create your account. Check the details and try again."
          : "We couldn't sign you in. Check your email and password.",
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === "sign-up" && (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-soft">Your name</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
      )}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-soft">Work email</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-soft">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={mode === "sign-up" ? 10 : undefined}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          className={inputClass}
        />
        {mode === "sign-up" && <span className="text-xs text-dim">At least 10 characters.</span>}
      </label>

      {error && (
        <p role="alert" className="text-sm text-amber">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary mt-2 px-4 py-2.5 font-medium disabled:opacity-60">
        {pending ? "One moment" : mode === "sign-up" ? "Create account" : "Sign in"}
      </button>

      <p className="text-sm text-soft">
        {mode === "sign-up" ? (
          <>
            Already have an account?{" "}
            <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="text-sky hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Outbound Labs?{" "}
            <Link href={`/sign-up?next=${encodeURIComponent(next)}`} className="text-sky hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
