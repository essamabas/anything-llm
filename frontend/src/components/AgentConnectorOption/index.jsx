import paths from "@/utils/paths";
import ConnectorImages from "./media";

export default function AgentConnectorOption({ slug }) {
  if (!AGENT_CONNECTORS.hasOwnProperty(slug)) return null;
  const { path, image, name, description, link } = AGENT_CONNECTORS[slug];

  return (
    <a href={path}>
      <label className="transition-all duration-300 inline-flex flex-col h-full w-60 cursor-pointer items-start justify-between rounded-2xl bg-preference-gradient border-2 border-transparent shadow-md px-5 py-4 text-white hover:bg-selected-preference-gradient hover:border-white/60 peer-checked:border-white peer-checked:border-opacity-90 peer-checked:bg-selected-preference-gradient">
        <div className="flex items-center">
          <img src={image} alt={name} className="h-10 w-10 rounded" />
          <div className="ml-4 text-sm font-semibold">{name}</div>
        </div>
        <div className="mt-2 text-xs font-base text-white tracking-wide">
          {description}
        </div>
        <a
          href={link}
          target="_blank"
          className="mt-2 text-xs text-white font-medium underline"
        >
          {link}
        </a>
      </label>
    </a>
  );
}

export const AGENT_CONNECTORS = {
  Jira: {
    name: "Jira",
    path: paths.settings.agentConnectors.jira(),
    image: ConnectorImages.Jira,
    description:
      "The Jira toolkit allows agents to interact with a given Jira instance, performing actions such as searching for issues and creating issues",
    link: "jira.auto.continental.cloud",
  },
};
