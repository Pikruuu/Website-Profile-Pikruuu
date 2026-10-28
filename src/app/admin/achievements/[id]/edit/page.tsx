import { notFound } from "next/navigation";
import AchievementForm from "@/components/admin/AchievementForm";
import { getAdminAchievementById } from "@/lib/data/achievements";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const achievement = await getAdminAchievementById(id);

    if (!achievement) {
        notFound();
    }

    return <AchievementForm mode="edit" achievement={achievement} />;
}
