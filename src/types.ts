export type PageArea = "public" | "student" | "admin";

export type PageKind =
  | "home"
  | "catalog"
  | "detail"
  | "listing"
  | "taxonomy"
  | "content"
  | "auth"
  | "checkout"
  | "legal"
  | "system"
  | "dashboard"
  | "player"
  | "analytics"
  | "messages"
  | "settings"
  | "form"
  | "editor"
  | "security"
  | "support"
  | "profile"
  | "billing"
  | "reports"
  | "media";

export interface PageDefinition {
  id: string;
  title: string;
  path: string;
  area: PageArea;
  group: string;
  kind: PageKind;
  description: string;
  primaryAction?: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
  tone?: "success" | "info" | "warning" | "danger";
}
