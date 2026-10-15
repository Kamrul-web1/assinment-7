
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SinginPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    // Login-এর পরে কোথায় ফিরে যাবে
    const getDestination = () => {
        const callbackURL = new URLSearchParams(
            window.location.search
        ).get("callbackURL");

        if (
            callbackURL?.startsWith("/") &&
            !callbackURL.startsWith("//")
        ) {
            return callbackURL;
        }

        return "/";
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        if (!email || !password) {
            toast.error("ইমেইল ও পাসওয়ার্ড দিন।");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(
                    error.message || "সাইন ইন করা যায়নি।"
                );
                return;
            }

            toast.success("সফলভাবে সাইন ইন হয়েছে!");

            router.replace(getDestination());
            router.refresh();
        } catch {
            toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setSocialLoading(provider);

        try {
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: getDestination(),
            });

            if (error) {
                toast.error(
                    error.message || "Social login ব্যর্থ হয়েছে।"
                );
                setSocialLoading("");
            }
        } catch {
            toast.error("Social login করা যায়নি।");
            setSocialLoading("");
        }
    };

    return (
        <main className="min-h-[390px] bg-[#F0F5F0] px-4 py-8 sm:py-10">
            <div className="mx-auto flex w-full max-w-md flex-col items-center">
                <h1 className="text-2xl font-bold text-[#202B23]">
                    সাইন ইন
                </h1>

                <p className="mt-2 text-center text-sm text-gray-500">
                    বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
                </p>

                <form
                    onSubmit={onSubmit}
                    className="mt-5 w-full rounded-xl border border-[#E0E8E0] bg-[#FAFCFA] p-5 sm:p-6"
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            ইমেইল
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            disabled={loading || !!socialLoading}
                            className="h-10 w-full rounded-md border border-[#E0E8E0] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10 disabled:opacity-60"
                        />

                        <label
                            htmlFor="password"
                            className="mt-2 text-sm font-medium text-gray-700"
                        >
                            পাসওয়ার্ড
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="আপনার পাসওয়ার্ড"
                            autoComplete="current-password"
                            required
                            disabled={loading || !!socialLoading}
                            className="h-10 w-full rounded-md border border-[#E0E8E0] bg-transparent px-3 text-sm outline-none transition focus:border-[#07883F] focus:ring-2 focus:ring-[#07883F]/10 disabled:opacity-60"
                        />

                        <button
                            type="submit"
                            disabled={loading || !!socialLoading}
                            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#07883F] text-sm font-semibold text-white shadow-md transition hover:bg-[#056D32] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />
                                    সাইন ইন হচ্ছে...
                                </>
                            ) : (
                                "সাইন ইন"
                            )}
                        </button>
                    </div>

                    <div className="my-4 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#E1E7E1]" />
                        <span className="text-xs text-gray-500">
                            অথবা
                        </span>
                        <div className="h-px flex-1 bg-[#E1E7E1]" />
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            disabled={loading || !!socialLoading}
                            className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#E0E8E0] bg-transparent px-2 text-xs font-medium text-gray-800 transition hover:bg-[#F0F5F0] disabled:opacity-60"
                        >
                            {socialLoading === "google" ? (
                                <span className="loading loading-spinner loading-xs" />
                            ) : (
                                <svg viewBox="0 0 48 48" className="h-4 w-4">
                                    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                                    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z" />
                                    <path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z" />
                                    <path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.3l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z" />
                                </svg>
                            )}
                            Google দিয়ে লগইন
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("github")}
                            disabled={loading || !!socialLoading}
                            className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#E0E8E0] bg-transparent px-2 text-xs font-medium text-gray-800 transition hover:bg-[#F0F5F0] disabled:opacity-60"
                        >
                            {socialLoading === "github" ? (
                                <span className="loading loading-spinner loading-xs" />
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current"
                                    aria-hidden="true"
                                >
                                    <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.4.7-4.1-1.5-4.1-1.5-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.2-3.2c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3.6c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
                                </svg>
                            )}
                            GitHub দিয়ে লগইন
                        </button>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        অ্যাকাউন্ট নেই?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-[#07883F] hover:underline"
                        >
                            সাইন আপ করুন
                        </Link>
                    </p>
                </form>

                <Link
                    href="/"
                    className="mt-5 text-sm text-gray-500 transition hover:text-[#07883F]"
                >
                    ← হোম পেজে ফিরে যান
                </Link>
            </div>
        </main>
    );
};

export default SinginPage;
