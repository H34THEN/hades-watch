export type ForumCallsignAuthor = {
  character?: { callsign: string | null } | null;
  name: string | null;
  email: string;
  forumProfile?: { displayName: string | null } | null;
};

export function resolveForumCallsign(author: ForumCallsignAuthor): string {
  return (
    author.forumProfile?.displayName ??
    author.character?.callsign ??
    author.name ??
    author.email.split("@")[0] ??
    "operative"
  );
}
