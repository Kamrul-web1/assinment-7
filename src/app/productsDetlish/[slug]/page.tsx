
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Market {
    market: string;
    division: string;
    min: number;
    max: number;
    average?: number;
}

interface Product {
    id?: number | string;
    nameBn?: string;
    name?: string;
    categoryNameBn?: string;
    category?: string;
    categoryIcon?: string;
    emoji?: string;
    unit?: string;
    today?: number;
    yesterday?: number;
    lastWeek?: number;
    lastMonth?: number;
    markets?: Market[];
}

const formatPrice = (price: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(price);

const BazarIdDetelsh = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await params;

    // Login check: user login না থাকলে details page দেখাবে না
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        const callbackURL = `/productsDetlish/${encodeURIComponent(slug)}`;

        redirect(
            `/signin?callbackURL=${encodeURIComponent(callbackURL)}`
        );
    }

    // User login করা থাকলে নিচের product fetch ও page render হবে
    let product: Product | null = null;

    try {
        const res = await fetch(
            `https://openapi.programming-hero.com/api/bazardor/products/${encodeURIComponent(slug)}`,
            {
                cache: "no-store",
            }
        );

        if (res.ok) {
            const result = await res.json();

            // API সরাসরি product অথবা data-এর মধ্যে product দিতে পারে
            product = result.data ?? result.product ?? result;
        }
    } catch (error) {
        console.error("Product fetch error:", error);
    }

    if (
        !product ||
        typeof product !== "object" ||
        (!product.nameBn && !product.name)
    ) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#f1f5f0] px-4">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mb-4 text-5xl">🔎</div>
                    <h1 className="text-xl font-bold text-gray-800">
                        পণ্যের তথ্য পাওয়া যায়নি
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        পণ্যটি খুঁজে পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    const markets = Array.isArray(product.markets)
        ? product.markets
        : [];

    const validMarkets = markets.filter(
        (market) =>
            Number.isFinite(Number(market.min)) &&
            Number.isFinite(Number(market.max))
    );

    const minPrice =
        validMarkets.length > 0
            ? Math.min(...validMarkets.map((market) => Number(market.min)))
            : null;

    const maxPrice =
        validMarkets.length > 0
            ? Math.max(...validMarkets.map((market) => Number(market.max)))
            : null;

    const averagePrice =
        validMarkets.length > 0
            ? validMarkets.reduce(
                (total, market) =>
                    total + (Number(market.min) + Number(market.max)) / 2,
                0
            ) / validMarkets.length
            : null;

    const productName = product.nameBn ?? product.name ?? "পণ্যের নাম";
    const categoryName = product.categoryNameBn ?? product.category ?? "অন্যান্য";
    const productIcon = product.emoji ?? product.categoryIcon ?? "🛒";

    return (
        <main className="min-h-screen bg-[#f1f5f0] px-3 py-5 text-gray-800 sm:px-5 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Breadcrumb */}
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="transition hover:text-emerald-700">
                        হোম
                    </Link>
                    <span>/</span>
                    <span>{categoryName}</span>
                    <span>/</span>
                    <span className="font-medium text-gray-800">{productName}</span>
                </nav>

                {/* Product Summary */}
                <section className="mb-5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#edf4ed] text-3xl sm:h-20 sm:w-20 sm:text-4xl">
                                {productIcon}
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                    {productName}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    তাজা ও প্রয়োজনীয় পণ্যের বাজারদর
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                                        {categoryName}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                        একক: {product.unit ?? "প্রযোজ্য নয়"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-100 bg-[#f1f8f1] px-5 py-4 text-center sm:min-w-36">
                            <p className="text-xs text-gray-500">আজকের দাম</p>
                            <p className="mt-1 text-2xl font-bold text-emerald-800">
                                {product.today != null
                                    ? `৳ ${formatPrice(Number(product.today))}`
                                    : "—"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {product.unit ? `প্রতি ${product.unit}` : "বর্তমান বাজারদর"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Price History */}
                <section className="mb-5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
                    <h2 className="mb-4 text-base font-bold text-gray-900 sm:text-lg">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
                            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
                            <p className="mt-2 text-xl font-bold text-emerald-700">
                                {minPrice !== null
                                    ? `৳ ${formatPrice(minPrice)}`
                                    : "—"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                বাজারের সর্বনিম্ন মূল্য
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
                            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
                            <p className="mt-2 text-xl font-bold text-red-600">
                                {maxPrice !== null
                                    ? `৳ ${formatPrice(maxPrice)}`
                                    : "—"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                বাজারের সর্বোচ্চ মূল্য
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-[#fbfdfb] p-4">
                            <p className="text-sm text-gray-500">গড় দাম</p>
                            <p className="mt-2 text-xl font-bold text-emerald-700">
                                {averagePrice !== null
                                    ? `৳ ${formatPrice(averagePrice)}`
                                    : "—"}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                সব বাজারের আনুমানিক গড়
                            </p>
                        </div>
                    </div>
                </section>

                {/* Market Prices Table */}
                <section className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                            বাজারভিত্তিক আজকের দাম
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            বিভিন্ন বাজারে {productName}-এর দাম তুলনা করুন
                        </p>
                    </div>

                    {validMarkets.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                                <thead className="bg-[#f2f7f2] text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">বাজার</th>
                                        <th className="px-4 py-3 font-semibold">বিভাগ</th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            সর্বনিম্ন
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            সর্বোচ্চ
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            গড় দাম
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {validMarkets.map((market, index) => {
                                        const marketAverage =
                                            market.average != null
                                                ? Number(market.average)
                                                : (Number(market.min) + Number(market.max)) / 2;

                                        return (
                                            <tr
                                                key={`${market.market}-${market.division}-${index}`}
                                                className="transition hover:bg-emerald-50/60"
                                            >
                                                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                                                    {market.market}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                                                    {market.division}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-emerald-700">
                                                    ৳ {formatPrice(Number(market.min))}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-red-600">
                                                    ৳ {formatPrice(Number(market.max))}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-800">
                                                    ৳ {formatPrice(marketAverage)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-[#fbfdfb] px-4 py-12 text-center">
                            <div className="mb-3 text-4xl">🏪</div>
                            <h3 className="font-semibold text-gray-800">
                                বাজারের তথ্য পাওয়া যায়নি
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                এই পণ্যের জন্য বর্তমানে বাজারভিত্তিক দাম উপলব্ধ নেই।
                            </p>
                        </div>
                    )}
                </section>

                <div className="py-6 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition hover:text-emerald-950"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default BazarIdDetelsh;
