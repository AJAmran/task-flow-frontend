import AuthGuard from "@/components/auth/auth-guard";
import AcceptInvitationForm from "@/components/form/accept-invitation-form";

export default function AcceptInvitationPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <AcceptInvitationForm />
        </div>
      </div>
    </AuthGuard>
  );
}
