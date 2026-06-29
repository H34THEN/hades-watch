import type { HubModuleStatus } from "@/lib/mmo/hub-types";

export function statusLabel(status: HubModuleStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "locked":
      return "Locked";
    case "coming-soon":
      return "Coming Soon";
    case "pending":
      return "Pending";
    case "admin-only":
      return "Admin";
    case "external":
      return "External";
    default:
      return status;
  }
}
