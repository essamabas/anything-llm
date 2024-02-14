const { Telemetry } = require("../../models/telemetry");
const setupTelemetry = require("../telemetry");
const fs = require("fs");
const https = require("https");
const path = require('path');


function getCertificates(directoryPath) {
  // Replace with the actual directory path
  const fullPath = path.resolve(directoryPath); // Ensure absolute path

  try {
    const files = fs.readdirSync(fullPath);
    const caFiles = files.filter(file => file.endsWith('.crt'));

    const caStructure = [];
    caFiles.forEach(file => {
      const filePath = path.join(fullPath, file);
      caStructure.push(fs.readFileSync(filePath));
    });

    return caStructure; // Return the constructed structure
  } catch (error) {
    console.error('Error reading directory:', error);
    return null; // Or throw an error if appropriate
  }
}

function bootSSL(app, port = 3001) {
  try {
    console.log(
      `\x1b[33m[SSL BOOT ENABLED]\x1b[0m Loading the certificate and key for HTTPS mode...`
    );

    const CertPath = process.env.HTTPS_CERT_PATH;  // Replace with the actual directory path
    console.log(`[BOOT]: CertPath ${CertPath} `);

    //const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
    const privateKey = '';
    // Add your Certificate under
    //const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH);
    const certificate = getCertificates(CertPath);

     console.log(`[BOOT]: certificate ${certificate} `);
     const credentials = { key: privateKey, cert: certificate };     

    https
      .createServer(credentials, app)
      .listen(port, async () => {
        await setupTelemetry();
        console.log(`Primary server in HTTPS mode listening on port ${port}`);
      })
      .on("error", catchSigTerms);
    return app;
  } catch (e) {
    console.error(
      `\x1b[31m[SSL BOOT FAILED]\x1b[0m ${e.message} - falling back to HTTP boot.`,
      {
        ENABLE_HTTPS: process.env.ENABLE_HTTPS,
        HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
        HTTPS_CERT_PATH: process.env.HTTPS_CERT_PATH,
        stacktrace: e.stack,
      }
    );
    return bootHTTP(app, port);
  }
}

function bootHTTP(app, port = 3001) {
  if (!app) throw new Error('No "app" defined - crashing!');

  app
    .listen(port, async () => {
      await setupTelemetry();
      console.log(`Primary server in HTTP mode listening on port ${port}`);
    })
    .on("error", catchSigTerms);
  return app;
}

function catchSigTerms() {
  process.once("SIGUSR2", function () {
    Telemetry.flush();
    process.kill(process.pid, "SIGUSR2");
  });
  process.on("SIGINT", function () {
    Telemetry.flush();
    process.kill(process.pid, "SIGINT");
  });
}

module.exports = {
  bootHTTP,
  bootSSL,
};
