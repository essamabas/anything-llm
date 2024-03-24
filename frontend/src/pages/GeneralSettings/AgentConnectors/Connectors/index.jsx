import paths from "@/utils/paths";
import { lazy } from "react";
import { useParams } from "react-router-dom";
const Jira = lazy(() => import("./Jira"));

const CONNECTORS = {
  Jira: Jira,
};

export default function AgentConnectorSetup() {
  const { connector } = useParams();
  if (!connector || !CONNECTORS.hasOwnProperty(connector)) {
    window.location = paths.home();
    return;
  }

  const Page = CONNECTORS[connector];
  return <Page />;
}
