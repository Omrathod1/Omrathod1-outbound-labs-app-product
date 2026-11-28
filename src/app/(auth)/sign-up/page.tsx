import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="mt-10 text-[32px] leading-tight font-[450] tracking-[-0.03em]">Create your account</h1>
      <p className="mt-2 mb-8 text-soft">Nothing sends until you approve it.</p>
      <Suspense>
        <AuthForm mode="sign-up" />
      </Suspense>
    </>
  );
}
