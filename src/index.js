const { app, BrowserWindow } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow;
let messageWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
  });
  messageWindow = new BrowserWindow({
    width: 300,
    height: 200,
    parent: mainWindow,
    show: false,
    frame: false,
  });
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  messageWindow.loadFile(path.join(__dirname, "./simpleMessage.html"));
  console.log(app.getName());
  //mainWindow.webContents.openDevTools();
  mainWindow.on("closed", (e) => {
    mainWindow = null;
  });
  messageWindow.on("closed", (e) => {
    messageWindow = null;
  });
  app.on("browser-window-focus", (event, window) => {
    if (mainWindow) messageWindow.show();
  });
  app.on("browser-window-blur", (event, window) => {
    if (mainWindow) messageWindow.hide();
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
