import Link from "next/link";
import { CommandButton } from "@/components/terminal/CommandButton";

export default function ProfileNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase">Signal Lost</p>
      <h1 className="mt-4 font-mono text-3xl tracking-widest uppercase">Operative Not Found</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        No profile world matches that callsign, or the operative has set their dossier to private.
      </p>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        Set your callsign on <Link href="/profile/edit" className="text-primary hover:underline">/profile/edit</Link> to activate your public profile signal.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/profile/world">
          <CommandButton size="sm">Your Profile World</CommandButton>
        </Link>
        <Link href="/profile/edit">
          <CommandButton size="sm" variant="outline">
            Edit Profile
          </CommandButton>
        </Link>
        <Link href="/dashboard">
          <CommandButton size="sm" variant="outline">
            Dashboard
          </CommandButton>
        </Link>
      </div>
    </div>
  );
}
