
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সার্ভারের সাথে সংযোগ করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  async function socialLogin(provider) {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
      }
    } catch {
      toast.error("সাইন ইন করা যায়নি");
    }
  }

  const inputStyle =
    "w-full rounded-lg border border-[#dce6df] bg-white px-3 py-2.5 text-sm text-[#1d271f] outline-none focus:border-[#078945]";

  return (
    <section className="mx-auto w-full max-w-[420px] py-5 sm:py-8">
      <div className="mb-5 text-center">
        <h1 className="text-xl font-bold text-[#1d271f]">
          সাইন ইন
        </h1>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="rounded-2xl border border-[#e1e9e3] bg-white p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium">
              ইমেইল
            </label>
            <input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              className={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium">
              পাসওয়ার্ড
            </label>
            <input
              id="signin-password"
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg cursor-pointer bg-[#078945] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#06773c] disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#e1e9e3]" />
          <span className="text-xs text-gray-500">অথবা</span>
          <div className="h-px flex-1 bg-[#e1e9e3]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => socialLogin("google")}
            className="flex items-center justify-center cursor-pointer gap-2 rounded-lg border border-[#dce6df] bg-white px-2 py-2.5 text-xs font-medium hover:bg-gray-50"
          >
            <span className="font-bold text-[#4285f4]">G</span>
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => socialLogin("github")}
            className="flex items-center justify-center cursor-pointer gap-2 rounded-lg border border-[#dce6df] bg-white px-2 py-2.5 text-xs font-medium hover:bg-gray-50"
          >
            <span className="font-bold">●</span>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-5 text-center cursor-pointer text-xs text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="font-semibold text-[#078945]">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-gray-400 cursor-pointer hover:text-[#078945]">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
