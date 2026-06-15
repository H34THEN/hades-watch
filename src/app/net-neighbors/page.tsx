import { NetNeighborHudPage } from "@/components/net-neighbors/NetNeighborHudPage";
import { isModerator } from "@/lib/auth/roles";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import {
  countPendingNetNeighbors,
  getApprovedNetNeighbors,
  getRecentApprovedNetNeighbors,
  getUserPendingNetNeighbors,
} from "@/lib/queries/net-neighbors";

export const metadata = { title: "Net Neighbors" };

export default async function NetNeighborsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const user = await getSessionUser();
  const [neighbors, recent, pendingCount] = await Promise.all([
    getApprovedNetNeighbors(),
    getRecentApprovedNetNeighbors(8),
    user && isModerator(user.roles) ? countPendingNetNeighbors() : Promise.resolve(0),
  ]);

  const pendingSubmissions =
    user && isApprovedUser(user)
      ? await getUserPendingNetNeighbors(user.id)
      : [];

  const canSubmit = !!user && isApprovedUser(user);
  let lockedMessage: string | undefined;
  if (!user) {
    lockedMessage = "Sign in to submit a Net Neighbor signal.";
  } else if (!isApprovedUser(user)) {
    lockedMessage = "Net Neighbor submissions open after operative approval.";
  }

  return (
    <NetNeighborHudPage
      neighbors={neighbors}
      recent={recent}
      pendingSubmissions={pendingSubmissions}
      canSubmit={canSubmit}
      lockedMessage={lockedMessage}
      isModerator={!!user && isModerator(user.roles)}
      pendingCount={pendingCount}
      showSubmittedSuccess={submitted === "1"}
    />
  );
}
