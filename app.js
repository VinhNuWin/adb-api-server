const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post("/send-deeplink", (req, res) => {
  const { deviceId, deepLinkUrl } = req.body;

  if (!deviceId || !deepLinkUrl) {
    return res.status(400).send("Device ID and deep link URL are required.");
  }

  const adbCommand = `adb -s ${deviceId} shell am start -a android.intent.action.VIEW -d "${deepLinkUrl}"`;

  exec(adbCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send("Failed to send deep link command");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).send("Error in executing deep link command");
    }
    res.send(`Deep link command sent successfully: ${stdout}`);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
