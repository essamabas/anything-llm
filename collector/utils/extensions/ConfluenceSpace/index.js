const ConfluenceLoader = require("./ConfluenceLoader");
const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");

async function loadConfluenceSpace(args) {
  const loader = new ConfluenceLoader(args);
  await loader.init();

  if (!loader.ready)
    return {
      success: false,
      reason: "Could not prepare Confluence for loading! Check URL",
    };

  console.log(
    `-- Working Confluence ${loader.baseUrl}/${loader.spaceKey} --`
  );
  const docs = await loader.recursiveLoader();
  if (!docs.length) {
    return {
      success: false,
      reason: "No files were found for those settings.",
    };
  }

  console.log(`[Confluence Loader]: Found ${docs.length} source files. Saving...`);
  const outFolder = slugify(
    `confluence-${loader.spaceKey}-${v4().slice(0, 4)}`
  ).toLowerCase();
  const outFolderPath = path.resolve(
    __dirname,
    `../../../../server/storage/documents/${outFolder}`
  );
  console.log(`[Confluence Loader]: Output-Folder ${outFolderPath}`);
  fs.mkdirSync(outFolderPath);

  for (const doc of docs) {
    if (!doc.pageContent) continue;
    console.log(`[Confluence Loader]: doc.metadata ${JSON.stringify(doc.metadata)}`);
    console.log(`[Confluence Loader]: doc ${JSON.stringify(doc)}`);

    const parts = doc.metadata.url.split('/'); // Split the url using a backslash as the delimiter
    const page_id = parts.pop(); // Remove and return the last element from the array
    console.log(page_id); // Output: file.txt
    console.log(`[Confluence Loader]: page_id ${page_id}`);

    const data = {
      id: v4(),
      url: doc.metadata.url,
      title: doc.metadata.title,
      docAuthor: page_id,
      description: "No description found.",
      docSource: doc.metadata.url,
      chunkSource: doc.metadata.url,
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent).length,
    };
    console.log(
      `[Confluence Loader]: Saving ${doc.metadata.source} to ${outFolder}`
    );
    writeToServerDocuments(
      data,
      `${page_id}`,
      outFolderPath
    );
  }

  return {
    success: true,
    reason: null,
    data: {
      author: loader.author,
      repo: loader.project,
      branch: loader.branch,
      files: docs.length,
      destination: outFolder,
    },
  };
}

module.exports = loadConfluenceSpace;
