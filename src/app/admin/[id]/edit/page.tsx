import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProjectById, getAdminProjects } from "@/lib/data/projects";
import { collectTechnologies } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [project, projectsResult] = await Promise.all([
        getAdminProjectById(id),
        getAdminProjects(),
    ]);

    if (!project) {
        notFound();
    }

    return (
        <ProjectForm
            mode="edit"
            project={project}
            technologies={collectTechnologies(projectsResult.projects)}
        />
    );
}
