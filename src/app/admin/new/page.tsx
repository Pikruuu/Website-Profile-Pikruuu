import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProjects } from "@/lib/data/projects";
import { collectTechnologies } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
    const { projects } = await getAdminProjects();

    return (
        <ProjectForm
            mode="create"
            technologies={collectTechnologies(projects)}
        />
    );
}
