import Image from "next/image";
import Tombol from '@/components/Tombol';
import { KartuTipeCol } from "@/components/Kartu";
import Link from "next/link";
import SumProject from "@/components/SumProject";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-8 bg-putih">
      <div className="text-5xl font-['Nulshock']">PORTOFOLIO</div>
      <div className="flex flex-row gap-8 justify-between w-full border-b-2 px-8 border-hitam -translate-y-16 animate-masuk-mulus">
        <div className="flex flex-col gap-8 justify-center">
          <h1 className="text-4xl font-bold font-['Nulshock'] text-hitam">
            HELLO, WELCOME!
            <br />I&apos;m Fikri
          </h1>
          <h2 className="font-['Komika'] text-hitam">
            I&apos;m an IT student, developer, and problem solver <br /> who enjoys researching technology and turning ideas <br />into practical solutions. My interests span AI, ML, data, IoT, and robotics.

          </h2>
          <div className="flex flex-row gap-8">
            <Tombol text="VIEW MY WORK" link="/project" />
            <Tombol text="DOWNLOAD CV" />
          </div>
        </div>
        <div className="grid grid-cols-1 grid-rows-1 place-items-center">
          <div className="col-start-1 row-start-1 w-128 h-128 bg-abu rounded-full flex items-center justify-center translate-y-32 z-1 blur-3xl" />
          <Image
            src="/images/myPhoto.png"
            alt="myPhoto"
            width={512}
            height={512}
            className="col-start-1 row-start-1 z-2"
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-8 justify-start w-full h-screen border-hitam py-4">
        <div className="flex flex-row justify-between w-full">
          <h1 className="text-xl font-['Nulshock'] text-hitam">Selected Project</h1>
          <div className="text-xl font-['Nulshock'] text-hitam duration-600 hover:scale-110 active:scale-50">
            <Link href="/project">View All Project...</Link>
          </div>
        </div>
        <ul className="flex flex-row gap-4">
          <KartuTipeCol
            photo="/images/project1.png"
            nomor="01"
            title="IoT/Robotics"
            deskripsi="IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.">
          </KartuTipeCol>
          <KartuTipeCol
            photo="/images/project1.png"
            nomor="02"
            title="IoT/Robotics"
            deskripsi="IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.">
          </KartuTipeCol>
          <KartuTipeCol
            photo="/images/project1.png"
            nomor="03"
            title="IoT/Robotics"
            deskripsi="IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.">
          </KartuTipeCol>
          <KartuTipeCol
            photo="/images/project1.png"
            nomor="04"
            title="IoT/Robotics"
            deskripsi="IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.">
          </KartuTipeCol>
          <KartuTipeCol
            photo="/images/project1.png"
            nomor="05"
            title="IoT/Robotics"
            deskripsi="IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.">
          </KartuTipeCol>
        </ul>
        <div className="h-4"/>
        <SumProject/>
      </div>
    </main>
  );
}