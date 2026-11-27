"use client";

import { useActionState } from "react";
import type { ActionState } from "./actions";

type Props = {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: Record<string, string>;
  label: string;
  pendingLabel: string;
  variant?: "primary" | "ghost";
};

export function ActionButton({ action, fields, label, pendingLabel, variant = "ghost" }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="flex flex-col items-start gap-1.5">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        disabled={pending}
        className={
          variant === "primary"
            ? "btn-primary px-4 py-2.5 font-medium disabled:opacity-60"
            : "rounded-[10px] border border-hairline px-3 py-1.5 text-sm text-soft hover:text-ink disabled:opacity-60"
        }
      >
        {pending ? pendingLabel : label}
      </button>
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
    </form>
  );
}
