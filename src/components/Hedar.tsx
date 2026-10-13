
import Image from "next/image";

const Hedar = () => {
    const data = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">

                {/* Logo and Date */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-4 ">
                    <Image
                        src="/logo-icon.png"
                        width={48}
                        height={48}
                        alt="বাজার দর"
                        className="h-9 w-9 shrink-0 object-contain sm:h-12 sm:w-12 rounded-xl bg-[#05893E] p-2"
                    />

                    <div className="min-w-0">
                        <h1 className="text-base font-bold text-gray-900 sm:text-xl md:text-2xl">
                            বাজার দর
                        </h1>

                        <p className="mt-1 text-[10px] text-gray-500 sm:text-sm">
                            {data}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                    <button className="btn rounded-xl px-2.5 text-xs sm:px-4 sm:text-sm">
                        সাইন ইন
                    </button>

                    <button className="btn rounded-xl bg-[#05893E] px-2.5 text-xs text-white sm:px-4 sm:text-sm">
                        সাইন আপ
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Hedar;
