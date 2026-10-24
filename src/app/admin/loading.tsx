export default function AdminLoading() {
    return (
        <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
            <div className="flex flex-col gap-3 border-b border-hitam/15 pb-6">
                <span className="h-2 w-24 animate-pulse bg-hitam/10" />
                <span className="h-8 w-64 animate-pulse bg-hitam/10" />
                <span className="h-3 w-full max-w-xl animate-pulse bg-hitam/10" />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="border border-hitam/15 bg-putih p-6"
                    >
                        <span className="block h-2 w-16 animate-pulse bg-hitam/10" />
                        <span className="mt-4 block h-7 w-12 animate-pulse bg-hitam/10" />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-hitam/15 pt-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <span
                        key={index}
                        className="block h-16 w-full animate-pulse bg-hitam/[0.04]"
                    />
                ))}
            </div>
            <span className="sr-only">Memuat dashboard...</span>
        </div>
    );
}
