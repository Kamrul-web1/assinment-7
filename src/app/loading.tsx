
export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F0F5F0] px-4 py-8">
            <div className="mx-auto max-w-7xl animate-pulse">
                {/* Page Heading */}
                <div className="mb-8">
                    <div className="h-8 w-48 rounded-md bg-gray-200" />
                    <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200" />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-xl border border-gray-200 bg-white p-3"
                        >
                            {/* Product Image */}
                            <div className="aspect-square rounded-lg bg-gray-200" />

                            {/* Product Name */}
                            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />

                            {/* Product Description */}
                            <div className="mt-2 h-3 w-full rounded bg-gray-200" />

                            {/* Product Price */}
                            <div className="mt-4 h-6 w-1/2 rounded bg-gray-200" />

                            {/* Button */}
                            <div className="mt-4 h-10 w-full rounded-lg bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
