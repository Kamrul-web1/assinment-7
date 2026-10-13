
import Image from "next/image";
import Link from "next/link";

const Bannar = () => {
    const today = new Date().toLocaleDateString("bn-BD", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 lg:px-8">
            <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-white p-4 sm:p-6 lg:grid-cols-3 lg:gap-6 lg:p-8">
                {/* Text: 2 columns */}
                <div className="flex flex-col items-start justify-center gap-4 lg:col-span-2">
                    <p className="text-sm font-medium bg-[#98f0be]  p-1.5  rounded-2xl text-[#05893E] sm:text-base">
                        {today}
                    </p>

                    <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
                        আজকের বাজারের দাম এক নজরে
                    </h2>

                    <p className="text-sm leading-7 text-gray-700 sm:text-base">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
                        দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <Link
                        href="/categories"
                        className="inline-flex items-center justify-center rounded-lg border border-white bg-[#05893E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 sm:text-base"
                    >
                        সব পণ্য দেখুন
                    </Link>
                </div>

                {/* Image: 1 column */}
                <div className="relative min-h-52 w-full overflow-hidden rounded-2xl border-2 border-white sm:min-h-64 lg:min-h-72">
                    <Image
                        src="/bazar-hero.png"
                        alt="আজকের বাজারের পণ্য"
                        fill
                        priority
                        sizes="(max-width: 1023px) 100vw, 33vw"
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default Bannar;
