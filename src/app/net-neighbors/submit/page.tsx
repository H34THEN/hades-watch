import Link from "next/link";
import { redirect } from "next/navigation";
import { NetNeighborSubmitForm } from "@/components/net-neighbors/NetNeighborSubmitForm";
import { CommandButton } from "@/components/terminal/CommandButton";
import { getSessionUser, isApprovedUser } from "@/lib/auth/session";
import styles from "@/components/net-neighbors/net-neighbors.module.css";

export const metadata = { title: "Submit Net Neighbor" };

export default async function NetNeighborsSubmitPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?callbackUrl=/net-neighbors/submit");
  }

  const canSubmit = isApprovedUser(user);

  return (
    <div className={styles.hudPage}>
      <div className="relative mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
        <div className="mb-6 flex flex-wrap justify-between gap-3">
          <Link href="/net-neighbors">
            <CommandButton size="sm" variant="outline">
              ← Net Neighbors Wall
            </CommandButton>
          </Link>
        </div>
        <NetNeighborSubmitForm
          canSubmit={canSubmit}
          lockedMessage={
            canSubmit
              ? undefined
              : "Net Neighbor submissions open after operative approval."
          }
          redirectOnSuccess
        />
      </div>
    </div>
  );
}
