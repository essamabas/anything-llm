import paths from "@/utils/paths";
import { lazy } from "react";
import { useParams } from "react-router-dom";
const Github = lazy(() => import("./Github"));
const YouTubeTranscript = lazy(() => import("./Youtube"));
const Confluence = lazy(() => import("./Confluence"));

const CONNECTORS = {
  github: Github,
  "youtube-transcript": YouTubeTranscript,
  Confluence: Confluence,
};

export default function DataConnectorSetup() {
  const { connector } = useParams();
  if (!connector || !CONNECTORS.hasOwnProperty(connector)) {
    window.location = paths.home();
    return;
  }

  const Page = CONNECTORS[connector];
  return <Page />;
}
