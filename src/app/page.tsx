import { redirect } from "next/navigation";

// The marketing site lives at outboundlabs.app. This app starts at /app,
// and the proxy sends anyone signed out to /sign-in.
export default function Home() {
  redirect("/app");
}
