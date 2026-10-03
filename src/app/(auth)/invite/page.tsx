import { redirect } from "next/navigation";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Backend invitation emails link here; forward to the real accept page
  // while preserving the token.
  redirect(`/accept-invitation${token ? `?token=${token}` : ""}`);
}
