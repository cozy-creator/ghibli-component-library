import { Navigate, useParams } from "react-router-dom";

export function LegacyComponentRedirect() {
  const { name } = useParams();

  return <Navigate replace to={name ? `/components/${name}` : "/components"} />;
}

export function LegacyPatternRedirect() {
  const { name } = useParams();

  return <Navigate replace to={name ? `/patterns/${name}` : "/patterns"} />;
}
