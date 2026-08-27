import Kapsul from "@/components/Kapsul"
import Image from "next/image"

export default function about() {
    return (
        <div className="flex flex-col bg-putih h-fit w-full p-8">
            <div className="flex flex-row gap-16 p-8">
                <div className="grid grid-cols-1 grid-rows-1 place-items-center h-128 w-128 border-2 border-hitam rounded-lg shadow shadow-hitam/70 p-4 shrink-0">
                    <div className="col-start-1 row-start-1 w-64 h-64 bg-abu rounded-full flex items-center justify-center translate-y-32 z-1 blur-3xl" />
                    <Image
                        src="/images/myPhoto.png"
                        alt="myPhoto"
                        width={256}
                        height={256}
                        className="col-start-1 row-start-1 self-end z-2 translate-x-4 translate-y-4"
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                    <div className="col-start-1 row-start-1 flex flex-row gap-2 z-3 justify-self-start self-end place-items-center border-2 border-hitam p-2 rounded-lg w-48 bg-putih">
                        <div className="w-2 h-2 bg-abu rounded-full -translate-y-3 shrink-0"></div>
                        <p className="font-['Komika']">Available for projects and collaboration</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="font-['Komika'] text-xl text-abu">About me</h4>
                    <h1 className="font-['Nulshock'] text-4xl">Hello i&apos;m Fikri</h1>
                    <p className="font-['Komika'] text-xl">I&apos;m an Information Technology student, developer, and problem solver who loves turning ideas into real impact. I enjoy exploring new technologies and building digital solutions that are useful, efficient, and meaningful.</p>
                    <div className="flex flex-row gap-4 items-center border-b-1 p-2 w-full font-['Komika']">
                        <div className="flex h-12 w-12 bg-putih rounded-lg shadow shadow-hitam/70 items-center justify-center">
                            icon
                        </div>
                        <p className="w-32 shrink-0">Name</p>
                        <p className="shrink-0">:</p>
                        <p>Muhammad Fikri Al Fathoni</p>
                    </div>
                    <div className="flex flex-row gap-4 items-center border-b-1 p-2 w-full font-['Komika']">
                        <div className="flex h-12 w-12 bg-putih rounded-lg shadow shadow-hitam/70 items-center justify-center">
                            icon
                        </div>
                        <p className="w-32 shrink-0">Education</p>
                        <p className="shrink-0">:</p>
                        <p>S1 TEKNOLOGI INFORMASI Telkom University (Semester 5)</p>
                    </div>
                    <div className="flex flex-row gap-4 items-center border-b-1 p-2 w-full font-['Komika']">
                        <div className="flex h-12 w-12 bg-putih rounded-lg shadow shadow-hitam/70 items-center justify-center">
                            icon
                        </div>
                        <p className="w-32 shrink-0">Location</p>
                        <p className="shrink-0">:</p>
                        <p>Surabaya</p>
                    </div>
                    <div className="flex flex-row gap-4 items-center border-b-1 p-2 w-full font-['Komika']">
                        <div className="flex h-12 w-12 bg-putih rounded-lg shadow shadow-hitam/70 items-center justify-center">
                            icon
                        </div>
                        <p className="w-32 shrink-0">Email</p>
                        <p className="shrink-0">:</p>
                        <p>alfathonimuhammadfikri@gmail.com</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-16 p-8">
                <div className="grid grid-rows-2 grid-cols-3 gap-2 h-fit w-full">
                    <div className="h-32 w-52 border-2"></div>
                    <div className="h-32 w-52 border-2"></div>
                    <div className="h-32 w-52 border-2"></div>
                    <div className="h-32 w-52 border-2"></div>
                    <div className="h-32 w-52 border-2"></div>
                    <div className="h-32 w-52 border-2"></div>
                </div>
                <div className="flex flex-col gap-2 h-auto w-128 rounded-lg border-2 border-hitam shadow shadow-hitam/70 p-4 shrink-0">
                    <div className="font-['Nulshock'] text-xl">Technologies Used</div>
                    <ul className="flex flex-wrap gap-4">
                        <li><Kapsul deskripsi="C++"/></li>
                        <li><Kapsul deskripsi="Python"/></li>
                        <li><Kapsul deskripsi="HTML"/></li>
                        <li><Kapsul deskripsi="CSS"/></li>
                        <li><Kapsul deskripsi="Next.js"/></li>
                        <li><Kapsul deskripsi="Vue"/></li>
                        <li><Kapsul deskripsi="SCSS"/></li>
                        <li><Kapsul deskripsi="Tailwind"/></li>
                        <li><Kapsul deskripsi="Flutter"/></li>
                        <li><Kapsul deskripsi="React-Native"/></li>
                        <li><Kapsul deskripsi="PostgreSQL"/></li>
                        <li><Kapsul deskripsi="VS Code"/></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
