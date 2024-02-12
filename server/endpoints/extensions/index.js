const { Telemetry } = require("../../models/telemetry");
const {
  forwardExtensionRequest,
} = require("../../utils/files/documentProcessor");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function extensionEndpoints(app) {
  if (!app) return;

  app.post(
    "/ext/github/branches",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/github-repo/branches",
          method: "POST",
          body: request.body,
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/github/repo",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/github-repo",
          method: "POST",
          body: request.body,
        });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "github_repo",
        });
        response.status(200).json(responseFromProcessor);
        console.log(response);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/confluence/space",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/confluence-space",
          method: "POST",
          body: request.body,
        });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "confluence_space",
        });
        response.status(200).json(responseFromProcessor);
        console.log(response);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/youtube/transcript",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/youtube-transcript",
          method: "POST",
          body: request.body,
        });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "youtube_transcript",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { extensionEndpoints };
