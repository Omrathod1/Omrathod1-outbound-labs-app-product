import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <>
      <h1 className="mt-10 text-[32px] leading-tight font-[450] tracking-[-0.03em]">Sign in</h1>
      <p className="mt-2 mb-8 text-soft">The agents do the work. You approve every campaign before it sends.</p>
      <Suspense>
        <AuthForm mode="sign-in" />
      </Suspense>
    </>
  );
}
