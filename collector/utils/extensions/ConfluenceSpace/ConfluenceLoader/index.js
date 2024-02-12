class ConfluenceLoader {
  constructor(args = {}) {
    this.ready = false;
    this.baseUrl = args?.baseUrl;
    this.spaceKey = args?.spaceKey;
    this.accessToken = args?.accessToken || null;
  }

  #validUrl() {
    return true;
  }

  async init() {
    if (!this.#validUrl()) return;
    this.ready = true;
    return this;
  }

  async recursiveLoader() {
    if (!this.ready) throw new Error("[Confluence Loader]: not in ready state!");
    const {
      ConfluencePagesLoader: LCConfluencePagesLoader,
    } = require("langchain/document_loaders/web/confluence");

    if (this.accessToken)
      console.log(
        `[Confluence Loader]: Access token set! Recursive loading enabled!`
      );

      const loader = new LCConfluencePagesLoader({
        baseUrl: this.baseUrl,
        spaceKey: this.spaceKey,
        personalAccessToken: this.accessToken,
      });

    const docs = await loader.load();
    return docs;
  }
}

module.exports = ConfluenceLoader;
