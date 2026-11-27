"use client";

import { useActionState } from "react";
import { createWorkspace, type WorkspaceFormState } from "./actions";

export function CreateWorkspaceForm() {
  const [state, action, pending] = useActionState<WorkspaceFormState, FormData>(createWorkspace, {});
  return (
    <form action={action} className="mt-8 flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-soft">Company name</span>
        <input
          name="name"
          required
          minLength={2}
          className="rounded-[10px] border border-hairline bg-transparent px-3 py-2.5 text-ink focus:border-sky focus:outline-none"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-amber">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary self-start px-4 py-2.5 font-medium disabled:opacity-60">
        {pending ? "Creating" : "Create workspace"}
      </button>
    </form>
  );
}
