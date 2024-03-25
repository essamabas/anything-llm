const { Telemetry } = require("../../models/telemetry");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function agentEndpoints(app) {
  if (!app) return;

  app.post(
    "/agent/jira/request",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
	  /*
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/github-repo/branches",
          method: "POST",
          body: request.body,
        });
		*/
		console.log("Jira Agent received request" + request.body);
        response.status(200).json({});
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

}

module.exports = { agentEndpoints };
