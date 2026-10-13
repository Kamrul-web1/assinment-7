
import Link from "next/link";

interface Inavs {
    slug: string;
    icon: string;
    nameBn: string;
}

const NavLinks = async () => {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/bazardor/categories"
    );

    const data: Inavs[] = await res.json();

    return (
        <div className="w-full px-3 sm:px-5 lg:px-8 border-[#E1E8E1] bg-[#FAFCFA]">
            <div className="mx-auto flex w-full max-w-7xl items-center gap-3 overflow-x-auto py-2 ">
                {data.map((d) => (
                    <Link
                        key={d.slug}
                        href={`/detlesh/${d.slug}`}
                        className="flex shrink-0 items-center gap-2 whitespace-nowrap "
                    >
                        <span>{d.icon}</span>
                        <span>{d.nameBn}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NavLinks;
