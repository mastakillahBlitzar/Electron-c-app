const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");

import { app, BrowserWindow } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

let connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "./core/Core")
  .build();

connection.onDisconnect = () => {
  console.log("lost");
};

const sendRequest = async () => {
  try {
    const result = await connection.send("greeting", "side-car App");
    window.webContents.send("greeting", result);
  } catch (error) {
    //handle error
    console.log(error);
  } finally {
    connection.close();
  }
};

sendRequest();
