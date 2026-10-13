import ProductList from "./ProductList";


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

interface ApiResponse {
    data: Product[];
}

const DetleshPage = async ({
    params,
}: {
    params: Promise<{ detleshid: string }>;
}) => {
    const { detleshid } = await params;

    const res = await fetch(
        `https://openapi.programming-hero.com/api/bazardor/products?category=${detleshid}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Products fetch failed");
    }

    const result: ApiResponse | Product[] = await res.json();

    const products = Array.isArray(result)
        ? result
        : result.data ?? [];

    return <ProductList products={products} />;
};

export default DetleshPage;