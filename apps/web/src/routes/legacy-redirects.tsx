import { Navigate, useParams } from "react-router-dom";

function HashRedirect({ hash }: { hash: string }) {
  return <Navigate replace to={{ hash, pathname: "/" }} />;
}

const guideHashBySlug: Record<string, string> = {
  development: "#storybook",
  "getting-started": "#install",
  installation: "#install",
  registry: "#install",
  theming: "#install"
};

const componentHashByName: Record<string, string> = {
  accordion: "#pattern-docs",
  avatar: "#component-user-display-box",
  badge: "#reference-screens",
  button: "#component-button",
  card: "#pattern-community-cards",
  "cartoon-button": "#component-cartoon-button",
  dialog: "#pattern-auth-forms",
  "dropdown-menu": "#component-generate-selects",
  "hand-drawn-frame": "#component-hand-drawn-frame",
  input: "#component-forms",
  label: "#component-forms",
  separator: "#component-separator",
  sheet: "#component-user-popup",
  skeleton: "#pattern-generate-job-card",
  tabs: "#component-tabs",
  textarea: "#component-forms",
  tooltip: "#component-generate-selects"
};

const patternHashByName: Record<string, string> = {
  "account-dialogs": "#pattern-account-dialogs",
  "account-sections": "#pattern-account-sections",
  "auth-dialog": "#pattern-auth-forms",
  "auth-forms": "#pattern-auth-forms",
  "community-cards": "#pattern-community-cards",
  "community-modals": "#pattern-community-modals",
  "docs-article": "#pattern-docs",
  "docs-faq-accordion": "#pattern-docs",
  "empty-state": "#pattern-feedback",
  "floating-action": "#pattern-feedback",
  "form-field": "#component-forms",
  "generate-controls": "#pattern-generate-controls",
  "generate-editor-bar": "#pattern-generate-editor-bar",
  "generate-job-card": "#pattern-generate-job-card",
  "layout-shell": "#component-user-popup",
  "marketing-sections": "#pattern-marketing-sections",
  "notice-banner": "#pattern-feedback",
  "page-shell": "#reference-screens",
  "sidebar-nav": "#component-user-popup"
};

export function LegacyComponentRedirect() {
  const { name } = useParams();

  return <HashRedirect hash={name ? (componentHashByName[name] ?? "#component-button") : "#component-button"} />;
}

export function LegacyPatternRedirect() {
  const { name } = useParams();

  return <HashRedirect hash={name ? (patternHashByName[name] ?? "#pattern-auth-forms") : "#pattern-auth-forms"} />;
}

export function LegacyGuideRedirect() {
  const { slug } = useParams();

  return <HashRedirect hash={slug ? (guideHashBySlug[slug] ?? "#install") : "#install"} />;
}

export function LegacyExamplesRedirect() {
  return <HashRedirect hash="#storybook" />;
}
