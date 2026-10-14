
import Link from "next/link";


type Product = {
    id: number;
    slug: string;
    nameBn: string;
    categoryNameBn: string;
    categoryIcon: string;
    image: string;
    unit: string;
    today: number;
    yesterday: number;
    change: {
        dir: "up" | "down" | "flat";
        pct: number;
    };
};

const API_URL =
    "https://openapi.programming-hero.com/api/bazardor/products";

const banglaNumber = (num: number) =>
    new Intl.NumberFormat("bn-BD").format(num);

const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
};

const ProductCard = ({
    product,
}: {
    product: Product;
}) => {
    const direction = product.change?.dir;
    const percentage = product.change?.pct ?? 0;

    const isImageUrl =
        /^https?:\/\//i.test(product.image || "") ||
        /^\/[^/]/.test(product.image || "");

    const badgeStyle =
        direction === "up"
            ? "bg-red-50 text-red-600"
            : direction === "down"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500";

    const changeText =
        direction === "up"
            ? `▲ ${banglaNumber(percentage)}%`
            : direction === "down"
                ? `▼ ${banglaNumber(percentage)}%`
                : `— ${banglaNumber(0)}%`;

    return (
        <Link
            href={`/productsDetlish/${product.id}`}
            className="block h-full"
        >
            <article className="flex min-w-0 flex-col justify-between rounded-2xl border border-[#E1E8E1] bg-white p-3 transition hover:border-green-200 hover:shadow-md sm:p-4">
                {/* Product image and information */}
                <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F1F5F1]">
                        {isImageUrl ? (
                            <img
                                src={product.image}
                                alt={product.nameBn}
                                className="h-full w-full object-contain p-1"
                            />
                        ) : (
                            <span className="text-2xl">
                                {product.image ||
                                    product.categoryIcon ||
                                    "🛒"}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-gray-500">
                            {product.categoryNameBn}
                        </p>

                        <h3 className="mt-1 truncate text-sm font-bold text-[#26352B] sm:text-base">
                            {product.nameBn}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                            {units[product.unit] ||
                                `প্রতি ${product.unit}`}
                        </p>
                    </div>
                </div>

                {/* Price and price change */}
                <div className="mt-4 flex items-end justify-between gap-2 border-t border-[#EEF1EE] pt-3">
                    <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                            আজকের দাম
                        </p>

                        <p className="mt-1 text-base font-bold text-[#26352B] sm:text-lg">
                            {banglaNumber(product.today)} টাকা
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            আগের দাম: {banglaNumber(product.yesterday)} টাকা
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${badgeStyle}`}
                    >
                        {changeText}
                    </span>
                </div>
            </article>
        </Link>
    );
};

const ProductGrid = ({
    items,
}: {
    items: Product[];
}) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product, index) => (
            <ProductCard
                key={product.id ?? product.slug ?? index}
                product={product}
            />
        ))}
    </div>
);

const SectionPage = async () => {
    const res = await fetch(API_URL, {
        next: { revalidate: 300 },
    });

    if (!res.ok) {
        throw new Error("পণ্যের ডেটা লোড করা যায়নি");
    }

    const result = await res.json();

    const products: Product[] = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.products)
                ? result.data.products
                : [];

    const risers = products
        .filter((p) => p.change?.dir === "up")
        .sort(
            (a, b) =>
                (b.change?.pct ?? 0) -
                (a.change?.pct ?? 0)
        )
        .slice(0, 6);

    const fallers = products
        .filter((p) => p.change?.dir === "down")
        .sort(
            (a, b) =>
                (b.change?.pct ?? 0) -
                (a.change?.pct ?? 0)
        )
        .slice(0, 6);

    return (
        <main className="mx-auto w-full max-w-7xl space-y-8 px-3 py-6 sm:space-y-10 sm:px-5 sm:py-8 lg:px-8">

            {/* দাম বেড়েছে */}
            <section>
                <div className="mb-4 sm:mb-5">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-[#26352B] sm:text-2xl">
                        <span className="text-red-500">▲</span>
                        আজ দাম বেড়েছে
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
                    </p>
                </div>

                {risers.length > 0 ? (
                    <ProductGrid items={risers} />
                ) : (
                    <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
                        দাম বাড়ার কোনো পণ্য পাওয়া যায়নি।
                    </p>
                )}
            </section>

            {/* দাম কমেছে */}
            <section>
                <div className="mb-4 sm:mb-5">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-[#26352B] sm:text-2xl">
                        <span className="text-green-600">▼</span>
                        আজ দাম কমেছে
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
                    </p>
                </div>

                {fallers.length > 0 ? (
                    <ProductGrid items={fallers} />
                ) : (
                    <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
                        দাম কমার কোনো পণ্য পাওয়া যায়নি।
                    </p>
                )}
            </section>

            {/* সব পণ্য */}
            <section
                id="সব-পণ্য"
                className="scroll-mt-24"
            >
                <div className="mb-4 sm:mb-5">
                    <h2 className="text-xl font-bold text-[#26352B] sm:text-2xl">
                        সব পণ্য
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন।
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        মোট {banglaNumber(products.length)} টি পণ্য
                    </p>
                </div>

                {products.length > 0 ? (
                    <ProductGrid items={products} />
                ) : (
                    <p className="rounded-xl bg-white p-4 text-sm text-gray-500">
                        কোনো পণ্যের ডেটা পাওয়া যায়নি।
                    </p>
                )}
            </section>

        </main>
    );
};

export default SectionPage;
