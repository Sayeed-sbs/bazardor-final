"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfile() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("আগে সাইন ইন করুন");
      router.push("/signin");
    }
    if (session) {
      setName(session.user.name);
    }
  }, [isPending, session, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      toast.error("নাম লিখুন");
      return;
    }
    setLoading(true);
    let error;
    try {
      ({ error } = await authClient.updateUser({ name: name.trim() }));
    } catch {
      error = { message: "সার্ভারের সাথে সংযোগ করা যায়নি" };
    }
    setLoading(false);
    if (error) {
      toast.error(error.message || "আপডেট করা যায়নি");
      return;
    }
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile");
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">তথ্য আপডেট করুন</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">নাম</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn bg-brand text-white w-full">
          {loading ? "অপেক্ষা করুন..." : "তথ্য আপডেট করুন"}
        </button>
      </form>
    </div>
  );
}