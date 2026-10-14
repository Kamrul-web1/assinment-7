
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Useringormation = () => {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setLoading(true);

        try {
            const result = await authClient.signOut();

            if (result.error) {
                toast.error("Sign out করা যায়নি");
                return;
            }

            setOpen(false);
            toast.success("সফলভাবে Sign out হয়েছে");
            router.push("/");
            router.refresh();
        } catch {
            toast.error("Sign out করতে সমস্যা হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    return (
        <div>
            {user ? (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        className="flex shrink-0 items-center gap-2 sm:gap-3"
                    >
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-9 w-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#05893E] font-semibold text-white">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}

                        <span className="max-w-28 truncate text-sm font-medium">
                            {user.name}
                        </span>

                        <span className="text-xs">▼</span>
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 text-gray-800 shadow-lg">
                            <div className="border-b px-4 py-3">
                                <p className="truncate text-sm font-semibold">
                                    {user.name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                    {user.email}
                                </p>
                            </div>

                            <Link
                                href="/profile"
                                onClick={() => setOpen(false)}
                                className="block px-4 py-3 text-sm hover:bg-gray-100"
                            >
                                My Profile
                            </Link>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={loading}
                                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                {loading ? "Signing out..." : "Sign Out"}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                    <Link
                        href="/signin"
                        className="btn rounded-xl px-2.5 text-xs sm:px-4 sm:text-sm"
                    >
                        সাইন ইন
                    </Link>

                    <Link
                        href="/signup"
                        className="btn rounded-xl bg-[#05893E] px-2.5 text-xs text-white sm:px-4 sm:text-sm"
                    >
                        সাইন আপ
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Useringormation;
