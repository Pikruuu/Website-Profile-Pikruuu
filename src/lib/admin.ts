export function isAdminEmail(email: string | null | undefined): boolean {
    const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!allowedEmail) {
        return true;
    }

    return Boolean(email && email.trim().toLowerCase() === allowedEmail);
}
