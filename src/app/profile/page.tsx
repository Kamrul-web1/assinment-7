
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
        }
    }, [session?.user?.name]);

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/signin");
        }
    }, [isPending, session, router]);

    if (isPending || !session?.user) {
        return (
            <main className="min-h-[500px] bg-[#F0F5F0] px-4 py-10">
                <div className="mx-auto max-w-2xl animate-pulse">
                    <div className="h-6 w-40 rounded bg-gray-200" />
                    <div className="mt-6 h-24 rounded-xl bg-white" />
                    <div className="mt-4 h-36 rounded-xl bg-white" />
                </div>
            </main>
        );
    }

    const user = session.user;

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newName = name.trim();

        if (!newName) {
            toast.error("আপনার নাম লিখুন।");
            return;
        }

        if (newName === user.name) {
            toast.info("নামে কোনো পরিবর্তন করা হয়নি।");
            return;
        }

        setSaving(true);

        try {
            const { error } = await authClient.updateUser({
                name: newName,
            });

            if (error) {
                toast.error(error.message || "নাম পরিবর্তন করা যায়নি।");
                return;
            }

            toast.success("নাম সফলভাবে আপডেট হয়েছে!");
        } catch {
            toast.error("আপডেট করতে সমস্যা হয়েছে।");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "সাইন আউট করা যায়নি।");
                return;
            }

            toast.success("সফলভাবে সাইন আউট হয়েছে!");
            router.replace("/signin");
            router.refresh();
        } catch {
            toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <main className="min-h-[500px] bg-[#F0F5F0] px-4 py-8 sm:py-10">
            <div className="mx-auto w-full max-w-2xl">

                {/* প্রোফাইল শিরোনাম */}
                <div className="mb-5">
                    <h1 className="text-xl font-bold text-[#202B23]">
                        আমার প্রোফাইল
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                {/* ব্যবহারকারীর তথ্য */}
                <section className="flex flex-col gap-4 rounded-xl border border-[#E0E8E0] bg-[#FAFCFA] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07883F] text-xl font-bold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate font-semibold text-gray-800">
                                {user.name || "ব্যবহারকারী"}
                            </h2>
                            <p className="truncate text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="shrink-0 self-start rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:self-auto"
                    >
                        {loggingOut ? "সাইন আউট হচ্ছে..." : "↪ সাইন আউট"}
                    </button>
                </section>

                {/* প্রোফাইল সম্পাদনা */}
                <section className="mt-4 rounded-xl border border-[#E0E8E0] bg-[#FAFCFA] p-5 sm:p-6">
                    <h2 className="font-semibold text-gray-800">
                        ব্যক্তিগত তথ্য
                    </h2>

                    <form onSubmit={handleUpdate} className="mt-6">
                        <label
                            htmlFor="profile-name"
                            className="mb-2 block text-sm text-gray-700"
                        >
                            আপনার নাম
                        </label>

                        <input
                            id="profile-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="আপনার নাম লিখুন"
                            maxLength={100}
                            required
                            disabled={saving}
                            className="h-10 w-full rounded-md border border-[#E0E8E0] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10 disabled:opacity-60"
                        />

                        <button
                            type="submit"
                            disabled={saving || !name.trim()}
                            className="mt-3 flex h-10 w-full items-center justify-center rounded-md bg-[#07883F] text-sm font-semibold text-white shadow-md transition hover:bg-[#056D32] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
