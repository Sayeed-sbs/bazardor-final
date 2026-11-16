
import Link from "next/link";

export default function NotFoundBox() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl items-center justify-center py-12">
      <div className="w-full rounded-2xl border border-[#e1e9e3] bg-white px-6 py-12 text-center sm:px-10">
        <div className="mb-4 text-6xl font-bold text-[#078945]">
          ৪০৪
        </div>

        <h1 className="text-xl font-bold text-[#202a22]">
          পেজটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          আপনি যে পেজ বা পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি।
          অনুগ্রহ করে হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#078945] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#06773c]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
