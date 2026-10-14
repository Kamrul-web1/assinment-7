
import Image from "next/image";
import NavLinks from "./NavLinks";
import Link from "next/link";
import Useringormation from "./Useringormation";

const Hedar = () => {
    const data = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">

                {/* Logo and Date */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-4 ">
                    <Link href={'/'}>
                        <Image

                            src="/logo-icon.png"
                            width={48}
                            height={48}
                            alt="বাজার দর"
                            className="h-9 w-9 shrink-0 object-contain sm:h-12 sm:w-12 rounded-xl bg-[#05893E] p-2"
                        /></Link>

                    <div className="min-w-0 " >
                        <h1 className="text-base font-bold text-gray-900 sm:text-xl md:text-2xl">
                            বাজার দর
                        </h1>

                        <p className="mt-1 text-[10px] text-gray-500 sm:text-sm">
                            {data}
                        </p>
                    </div>
                </div>

                {/* Buttons */}

                <Useringormation />
            </div>
            <NavLinks />
        </header>
    );
};

export default Hedar;
