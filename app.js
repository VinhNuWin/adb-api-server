const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3001;

const app = express();
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.json());

app.post("/send-deeplink", (req, res) => {
  console.log("Received ADB request:", req.body);
  const { deviceId, deepLinkUrl } = req.body;
  if (!deviceId || !deepLinkUrl) {
    console.log("Missing deviceId or deepLinkUrl in request.");
    return res.status(400).send("Device ID and deep link URL are required.");
  }

  const adbCommand = `adb -s ${deviceId} shell am start -a android.intent.action.VIEW -d "${deepLinkUrl}"`;
  console.log("Executing ADB command:", adbCommand);

  exec(adbCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Failed to send deep link command");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send("Error in executing deep link command");
    }
    console.log(`ADB command successful: ${stdout}`);
    res.send(`Deep link command sent successfully: ${stdout}`);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Please use a different port.`
    );
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server has shut down.");
  });
});
