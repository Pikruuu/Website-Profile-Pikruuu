"use client";

import { useState } from "react";
import { KartuTipeRow } from "@/components/Kartu";
import SumProject from "@/components/SumProject";

const TABS_PROJECT = [
    { id: "all", label: "All" },
    { id: "web", label: "Web App" },
    { id: "mobile", label: "Mobile App" },
    { id: "iot/robotic", label: "IoT/Robotic" },
    { id: "data", label: "Data / ML" },
];
const TABS_PUBLIKASI = [
    { id: "all", label: "All" },
    { id: "jurnal", label: "Journal" },
    { id: "hki", label: "Property" },
    { id: "git", label: "GitHub" },
    { id: "media", label: "Media" },
];

const PROJECTS = [
    {
        id: 1,
        nomor: "01",
        title: "IoT/Robotics",
        href: "https://voxsight.id/",
        deskripsi: "VoxSight AI adalah kacamata pintar berbasis AI untuk membantu penyandang tunanetra mengenali lingkungan sekitar secara real-time melalui suara.",
        photo: "/images/iot01.png",
        category: "iot/robotic",
    },
];

const PUBLIKASI = [
    {
        id: 1,
        nomor: "01",
        title: "Article",
        href: "https://share.google/hRmtIKI7AgaHt9w4C",
        deskripsi: "Modul Implementasi Dan Sosialisasi Teknologi Kacamata Pintar Berbasis Ai Interaktif Bagi Penyandang Disabilitas Netra Di Lingkungan Slb A Yayasan Pendidikan Anak Buta Surabaya.",
        photo: "/images/Article01.png",
        category: "media",
    },
    {
        id: 2,
        nomor: "02",
        title: "Article",
        href: "https://share.google/bqT0Cl4RZZ8Cf3bNC",
        deskripsi: "Surabaya, 6 Maret 2026 — Tim Pengabdian Masyarakat Telkom University Surabaya Kenalkan Kacamata Pintar VoxSight AI kepada Siswa Tunanetra di SLB A YPAB Surabaya",
        photo: "/images/Article02.png",
        category: "media",
    },
];

export default function ProjectTabs() {
    const [activeTabProject, setActiveTabProject] = useState("all");
    const [activeTabPublikasi, setActiveTabPublikasi] = useState("all");

    const filteredProjects =
        activeTabProject === "all"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === activeTabProject);

    const filteredPublikasi =
        activeTabPublikasi === "all"
            ? PUBLIKASI
            : PUBLIKASI.filter((p) => p.category === activeTabPublikasi);

    return (
        <div className="flex flex-col gap-16 w-full bg-putih min-h-screen p-8 pb-20">
            <div className="flex flex-col gap-4 w-2/3 p-2">
                <h1 className="font-['Nulshock'] text-4xl text-hitam">
                    My Project
                </h1>
                <p className="font-['Komika'] text-base text-hitam">
                    Welcome to my project portfolio. Here, you will find a carefully curated collection of my past and ongoing work. Each project represents a unique challenge I have tackled, reflecting my continuous learning process and dedication to building effective solutions.
                </p>
            </div>
            <SumProject/>
            <div>
                <div className="flex items-center gap-2 mb-8">
                    {TABS_PROJECT.map((tab) => {
                        const isActive = activeTabProject === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabProject(tab.id)}
                                className={`flex flex-row gap-2 px-5 py-2 rounded-full text-sm font-['Komika'] transition-colors duration-1000 cursor-pointer ${isActive
                                    ? "bg-abu text-putih"
                                    : "text-hitam hover:text-abu"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {filteredProjects.map((project) => (
                        <KartuTipeRow
                            key={project.id}
                            photo={project.photo}
                            nomor={project.nomor}
                            title={project.title}
                            href={project.href}
                            deskripsi={project.deskripsi}
                        />
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-8">
                    {TABS_PUBLIKASI.map((tab) => {
                        const isActive = activeTabPublikasi === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTabPublikasi(tab.id)}
                                className={`flex flex-row gap-2 px-5 py-2 rounded-full text-sm font-['Komika'] transition-colors duration-1000 cursor-pointer ${isActive
                                    ? "bg-abu text-putih"
                                    : "text-hitam hover:text-abu"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <ul className="grid grid-cols-2 gap-4">
                    {filteredPublikasi.map((publikasi) => (
                        <KartuTipeRow
                            key={publikasi.id}
                            photo={publikasi.photo}
                            nomor={publikasi.nomor}
                            title={publikasi.title}
                            href={publikasi.href}
                            deskripsi={publikasi.deskripsi}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
