"use client";

import { useState } from "react";
import { KartuTipeRow } from "@/components/Kartu";
import SumProject from "@/components/SumProject";

const TABS = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web App" },
    { id: "mobile", label: "Mobile App" },
    { id: "iot/robotic", label: "IoT/Robotic" },
    { id: "data", label: "Data / ML" },
];

const PROJECTS = [
    {
        id: 1,
        nomor: "01",
        title: "IoT/Robotics",
        deskripsi: "IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.",
        photo: "/images/project1.png",
        category: "iot/robotic",
    },
    {
        id: 2,
        nomor: "02",
        title: "IoT/Robotics",
        deskripsi: "IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.",
        photo: "/images/project1.png",
        category: "iot/robotic",
    },
    {
        id: 3,
        nomor: "03",
        title: "Mobile App",
        deskripsi: "IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.",
        photo: "/images/project1.png",
        category: "mobile",
    },
    {
        id: 4,
        nomor: "04",
        title: "Web App",
        deskripsi: "IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.",
        photo: "/images/project1.png",
        category: "web",
    },
    {
        id: 5,
        nomor: "05",
        title: "Data/ML",
        deskripsi: "IoT dan robotika adalah teknologi yang mengintegrasikan jaringan perangkat cerdas pengumpul data dengan mesin otomatis untuk mengeksekusi tugas fisik secara mandiri.",
        photo: "/images/project1.png",
        category: "data",
    },
];

export default function ProjectTabs() {
    const [activeTab, setActiveTab] = useState("all");

    const filteredProjects =
        activeTab === "all"
            ? PROJECTS
            : PROJECTS.filter((p) => p.category === activeTab);

    return (
        <div className="flex flex-col gap-16 w-full bg-putih min-h-screen p-8">
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
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                            deskripsi={project.deskripsi}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}