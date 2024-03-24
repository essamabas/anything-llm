import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

const AgentConnector = {
  Jira: {
    collect: async function ({ baseUrl, spaceKey, accessToken}) {
      return await fetch(`${API_BASE}/ext/confluence/space`, {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ baseUrl, spaceKey, accessToken}),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return { data: res.data, error: null };
        })
        .catch((e) => {
          console.error(e);
          return { data: null, error: e.message };
        });
    },
  },  
};

export default AgentConnector;
