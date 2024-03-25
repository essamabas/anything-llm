import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

const Agent = {
  Jira: {
    request: async ({request}) => {
	  console.log("received Jira Request");
      return await fetch(`${API_BASE}/agent/jira/request`, {
        method: "POST",
        headers: baseHeaders(),
        cache: "force-cache",
        body: JSON.stringify({request}),
      })
	  /*
        .then((res) => res.json())
        .then((res) => {
          if (!res.success) throw new Error(res.reason);
          return res.data;
        })
        .then((data) => {
          return { branches: data?.branches || [], error: null };
        })
		*/
        .catch((e) => {
          console.error(e);
          showToast(e.message, "error");
          return { branches: [], error: e.message };
        });
    },
  }
}

export default Agent;
