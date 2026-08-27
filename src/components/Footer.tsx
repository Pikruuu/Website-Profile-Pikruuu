import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-hitam text-putih font-['Komika'] px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 pr-10 border-b border-abu/40">
                <div className="max-w-sm">
                    <h2 className="font-['Nulshock'] text-xl font-bold mb-2">
                        Muhammad Fikri Al Fathoni
                    </h2>
                    <p className="text-sm text-abu">
                        Membangun solusi IoT, AI/ML, dan aplikasi mobile dengan pendekatan yang rapi dan fungsional.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-['Nulshock'] text-sm mb-1 text-abu">Navigasi</h3>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link href="/" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">Home</Link>
                        </li>
                        <li>
                            <Link href="/about" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">About</Link>
                        </li>
                        <li>
                            <Link href="/skill" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">Skill</Link>
                        </li>
                        <li>
                            <Link href="/project" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">Project</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">Contact</Link>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-['Nulshock'] text-sm mb-1 text-abu">Connect</h3>
                    <ul className="flex flex-col gap-2">
                        <li>
                            <Link href="https://github.com/Pikruuu" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">GitHub</Link>
                        </li>
                        <li>
                            <Link href="https://linkedin.com/in/muhammad-fikri-al-fathoni-6ab0b529a" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">LinkedIn</Link>
                        </li>
                        <li>
                            <Link href="#" className="inline-block font-['Komika'] text-sm transition-all duration-500 hover:text-abu hover:translate-x-2">WhatsApp</Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-abu">
                <p>© {year} Muhammad Fikri Al Fathoni. All rights reserved.</p>
                <p>Built with Next.js & Tailwind CSS</p>
            </div>
        </footer>
    );
}
