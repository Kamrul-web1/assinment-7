
'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const SingUpPage = () => {
    const router = useRouter();

    const onsubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: "/",
        });

        if (error) {
            console.error("Signup error:", error);
            console.error("Error message:", error.message);
            return;
        }

        if (data) {
            console.log("Signup success:", data);
            router.push("/");
        }
    };

    const handelclick = async () => {
        const data = await authClient.signIn.social({
            provider: "google",
        });
        console.log(data);

    }

    return (
        <div className="flex flex-col items-center justify-center mt-9">
            <h2 className="text-2xl font-bold">সাইন আপ</h2>

            <p className="text-base">
                বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্ট খুলুন।
            </p>

            <form onSubmit={onsubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <label className="label">নাম</label>
                    <input
                        name="name"
                        type="text"
                        className="input"
                        placeholder="আপনার নাম"
                        required
                    />

                    <label className="label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="input"
                        placeholder="Email"
                        required
                    />

                    <label className="label">পাসওয়ার্ড</label>
                    <input
                        name="password"
                        type="password"
                        className="input"
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        minLength={8}
                        required
                    />

                    <button
                        type="submit"
                        className="btn bg-[#047F39] btn-neutral mt-4"
                    >
                        সাইন আপ
                    </button>
                </fieldset>
            </form>
            <button onClick={handelclick} className="btn">sign In with Gogol</button>
        </div>
    );
};

export default SingUpPage;
