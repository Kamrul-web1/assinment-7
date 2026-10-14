

const SinginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-9">
            <h2 className=" text-2xl font-bold ">সাইন ইন</h2>
            <p className="text-1xl ">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
            <form >
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">




                    <label className="label">Email</label>
                    <input name="email" type="email" className="input" placeholder="Email" />

                    <label className="label">পাসওয়ার্ড</label>
                    <input name="password" type="password" className="input" placeholder="কমপক্ষে ৮ অক্ষর" />

                    <button className="btn bg-[#047F39] btn-neutral mt-4">সাইন ইন</button>
                </fieldset>
            </form>
        </div>
    );
};

export default SinginPage;