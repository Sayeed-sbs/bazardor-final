import Link from "next/link";

export default function NotFoundBox() {
  return (
    <div className="text-center py-20">
      <p className="text-6xl font-bold text-brand">৪০৪</p>
      <p className="mt-3 text-gray-600">দুঃখিত, আপনি যা খুঁজছেন তা পাওয়া যায়নি।</p>
      <Link href="/" className="btn bg-brand text-white mt-6">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}