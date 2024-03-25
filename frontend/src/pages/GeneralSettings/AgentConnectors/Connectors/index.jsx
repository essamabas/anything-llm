import paths from "@/utils/paths";
import { lazy } from "react";
import { useParams } from "react-router-dom";
const Jira = lazy(() => import("./Jira"));

const CONNECTORS = {
  jira: Jira,
};

export default function AgentConnectorSetup() {
  const { agentConnector } = useParams();
  if (!agentConnector || !CONNECTORS.hasOwnProperty(agentConnector)) {
    //window.location = paths.home();
    return;
  }

  const Page = CONNECTORS[agentConnector];
  return <Page />;
}
