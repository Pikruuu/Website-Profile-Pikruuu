import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
    const { settings } = await getAdminSiteSettings();

    return (
        <ProjectForm
            mode="create"
            technologies={settings.technologies}
        />
    );
}
