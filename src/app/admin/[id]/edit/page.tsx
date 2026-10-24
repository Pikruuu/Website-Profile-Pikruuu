import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProjectById } from "@/lib/data/projects";
import { getAdminSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [project, settingsResult] = await Promise.all([
        getAdminProjectById(id),
        getAdminSiteSettings(),
    ]);

    if (!project) {
        notFound();
    }

    return (
        <ProjectForm
            mode="edit"
            project={project}
            technologies={settingsResult.settings.technologies}
        />
    );
}
