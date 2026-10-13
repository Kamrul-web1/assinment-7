
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

export interface IProduct {
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
}


const Marque = async () => {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/bazardor/products"
    );

    const result = await res.json();
    const data: IProduct[] = result.data ?? result;

    return (

        <div className="w-full overflow-hidden border-y border-gray-200 bg-white py-1.5 sm:py-2">
            <MarqueeText direction="right" duration={6}>
                {data.map((marq: IProduct) => (
                    <span
                        key={marq.id}
                        className="mx-2 inline-flex items-center gap-1.5 whitespace-nowrap text-xs sm:mx-3 sm:gap-2 sm:text-sm md:mx-4"
                    >
                        <span>{marq.categoryIcon || marq.image}</span>

                        <span className="font-semibold">{marq.nameBn}</span>

                        <span className="font-bold">৳{marq.today}</span>

                        <span className="text-gray-500">
                            / {marq.unit === "kg" ? "কেজি" : marq.unit}
                        </span>

                        <span
                            className={
                                marq.change.dir === "up"
                                    ? "font-semibold text-red-600"
                                    : marq.change.dir === "down"
                                        ? "font-semibold text-green-600"
                                        : "font-semibold text-gray-500"
                            }
                        >
                            {marq.change.dir === "up"
                                ? "▲"
                                : marq.change.dir === "down"
                                    ? "▼"
                                    : "—"}{" "}
                            {marq.change.pct}%
                        </span>
                    </span>
                ))}
            </MarqueeText>
        </div>

    );
};

export default Marque;
