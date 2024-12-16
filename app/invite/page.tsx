import InviteVerification from "@/components/invite-verification";
import { Suspense } from "react";

const InvitePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteVerification />
    </Suspense>
  );
};

export default InvitePage;
