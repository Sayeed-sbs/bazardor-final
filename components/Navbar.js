
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    setDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      setMenuOpen(false);
      toast.success("সাইন আউট সম্পন্ন হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setLoggingOut(false);
    }
  }

  const user = session?.user;

  const initial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="relative z-40 border-b border-[#e4ebe6] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#078945]">
            <img
              src="/logo-icon.png"
              alt="বাজার দর"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div>
            <p className="text-lg font-bold leading-tight text-[#202a22]">
              বাজার দর
            </p>

            <p className="mt-0.5 text-[10px] text-gray-500">
              {date}
            </p>
          </div>
        </Link>

        {user ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-controls="profile-dropdown"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#f2f6f2]"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f4e9] text-sm font-bold text-[#078945]">
                  {initial}
                </div>
              )}

              <span className="max-w-24 truncate text-sm cursor-pointer font-medium text-[#202a22] sm:max-w-36">
                {user.name || "ব্যবহারকারী"}
              </span>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-gray-500 cursor-pointer transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 top-full cursor-pointer z-50 mt-2 w-60 rounded-xl border border-[#e1e9e3] bg-white p-3 shadow-lg"
              >
                <div className="border-b border-[#edf1ed] px-2 pb-3">
                  <p className="truncate text-sm font-bold text-[#202a22]">
                    {user.name || "ব্যবহারকারী"}
                  </p>

                  <p className="mt-0.5 break-all text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-[#202a22] transition hover:bg-[#f2f6f2]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                    </svg>

                    আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>

                    {loggingOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#202a22] transition hover:bg-[#f2f6f2]"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-[#078945] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#06773c]"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      <nav className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 pb-3">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            pathname === "/"
              ? "bg-[#078945] text-white"
              : "text-[#202a22] hover:bg-[#f2f6f2]"
          }`}
        >
          সব
        </Link>

        {categories.map((category) => {
          const active = pathname === `/category/${category.slug}`;

          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#078945] text-white"
                  : "text-[#202a22] hover:bg-[#f2f6f2]"
              }`}
            >
              {category.icon} {category.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
