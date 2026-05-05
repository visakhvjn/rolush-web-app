"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email")?.toString() ?? "";
    const password = fd.get("password")?.toString() ?? "";

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.replace("/admin/orders");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef3f9] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#d4dde6] bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-[#0f2f4f]">
          Rolush admin
        </h1>
        <p className="mt-1 text-sm text-[#4f6479]">Sign in to manage orders</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0f2f4f]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0f2f4f]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-[#d4dde6] px-3 py-2 text-[#0f2f4f] outline-none ring-[#d3b06a] focus:ring-2"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[#0f2f4f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0b2239] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
