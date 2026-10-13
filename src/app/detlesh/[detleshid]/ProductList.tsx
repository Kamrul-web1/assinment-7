"use client";

import { useState } from "react";

interface Product {
    id: number;
    slug: string;
    nameBn: string;
    category: string;
    categoryNameBn: string;
    categoryIcon: string;
    unit: string;
    image: string;
    today: number;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
    change: {
        dir: "up" | "down" | "same";
        pct: number;
    };
    markets: {
        market: string;
        division: string;
        min: number;
        max: number;
    }[];
}

interface ProductListProps {
    products: Product[];
}

export default function ProductList({
    products,
}: ProductListProps) {
    const [sort, setSort] = useState("default");

    const sortedProducts = [...products].sort((a, b) => {
        if (sort === "low") return a.today - b.today;
        if (sort === "high") return b.today - a.today;
        return 0;
    });

    const firstProduct = products[0];

    if (!firstProduct) {
        return (
            <main className="min-h-screen bg-[#eff5ef] px-4 py-5 sm:px-6">
                <div className="mx-auto w-full max-w-7xl rounded-xl border border-[#e0e9e0] bg-[#fbfdfb] p-8 text-center">
                    <p className="mb-4 text-gray-700">
                        এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
                    </p>


                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#eff5ef] px-4 py-5 sm:px-6">
            <div className="mx-auto w-full max-w-7xl">
                {/* Category Header */}
                <section className="flex items-center gap-2 rounded-xl border border-[#e0e9e0] bg-[#fbfdfb] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                        {firstProduct.categoryIcon}
                    </div>

                    <div>
                        <h1 className="text-lg font-bold text-[#26352b]">
                            {firstProduct.categoryNameBn}
                        </h1>

                        <p className="text-[11px] text-gray-500">
                            {products.length}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </section>

                {/* Sort Control */}
                <section className="mt-4 flex items-center justify-end gap-2 rounded-xl border border-[#e0e9e0] bg-[#fbfdfb] p-3">
                    <label
                        htmlFor="sort"
                        className="text-xs text-gray-500"
                    >
                        সাজান
                    </label>

                    <select
                        id="sort"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-700 outline-none focus:border-green-600"
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low">দাম: কম থেকে বেশি</option>
                        <option value="high">দাম: বেশি থেকে কম</option>
                    </select>
                </section>

                <p className="my-3 text-xs text-gray-500">
                    মোট {sortedProducts.length}টি পণ্য দেখানো হচ্ছে
                </p>

                {/* Product Cards */}
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="w-full rounded-xl border border-[#e0e9e0] bg-[#fbfdfb] p-3 text-[#26352b]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff5ef] text-xl">
                                    {product.image}
                                </div>

                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-bold">
                                        {product.nameBn}
                                    </h2>

                                    <p className="text-[11px] text-gray-500">
                                        প্রতি{" "}
                                        {product.unit === "kg"
                                            ? "কেজি"
                                            : product.unit}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 flex items-end justify-between gap-2">
                                <div>
                                    <p className="text-[10px] text-gray-500">
                                        আজকের দাম
                                    </p>

                                    <p className="text-base font-bold">
                                        {product.today.toLocaleString("bn-BD")} টাকা
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${product.change.dir === "up"
                                        ? "bg-red-50 text-red-600"
                                        : product.change.dir === "down"
                                            ? "bg-green-50 text-green-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {product.change.dir === "up"
                                        ? "▲"
                                        : product.change.dir === "down"
                                            ? "▼"
                                            : "—"}{" "}
                                    {product.change.pct.toLocaleString("bn-BD")}%
                                </span>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}