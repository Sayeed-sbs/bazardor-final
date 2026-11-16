
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন");
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <div className="mx-auto mt-10 max-w-[680px] space-y-4">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-44 w-full rounded-2xl" />
      </div>
    );
  }

  const user = session.user;
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <section className="mx-auto w-full max-w-[680px] py-8 sm:py-12">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#1d271f]">
          আমার প্রোফাইল
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#e1e9e3] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Profile"}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#e3f4e9] text-2xl font-bold text-[#078945]">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#1d271f]">
              {user.name || "ব্যবহারকারী"}
            </h2>
            <p className="break-all text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          ↩ সাইন আউট
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e1e9e3] bg-white p-5 sm:p-6">
        <h2 className="mb-6 text-base font-bold text-[#1d271f]">
          তথ্য
        </h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              নাম
            </label>
            <div className="w-full rounded-lg border border-[#dce6df] bg-white px-3 py-2.5 text-sm text-gray-600">
              {user.name || "নাম দেওয়া হয়নি"}
            </div>
          </div>

          <Link
            href="/profile/update"
            className="flex w-full items-center justify-center rounded-lg bg-[#078945] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#06773c]"
          >
            আপডেট
          </Link>
        </div>
      </div>
    </section>
  );
}
