const {
  app,
  BrowserWindow,
  session,
  Menu,
  MenuItem,
  ContextMenu,
} = require("electron");
const path = require("path");

//dealing with menus
let menu = new Menu();
let menuItem = new MenuItem({
  label: "Menu",
  submenu: [
    { label: "new" },
    { label: "open" },
    { label: "save" },
    { label: "save as" },
    {
      label: "close",
      submenu: [{ label: "close all" }, { label: "close the opened window" }],
    },
  ],
});
menu.append(menuItem);
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
let mainWindow;
let messageWindow;

const createWindow = () => {
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  messageWindow = new BrowserWindow({
    width: 300,
    height: 200,
    parent: mainWindow,
    show: false,
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
  let ses = session.defaultSession;
  ses.on("will-download", (e, item, webcontent) => {
    let size = item.getTotalBytes();
    item.on("done", () => {});
    item.on("updated", (e, state) => {
      let receivedSize = item.getReceivedBytes();
      if (state === "progressing" && receivedSize) {
        let progress = Math.round((receivedSize / size) * 100);
        webcontent.executeJavaScript(`window.progress.value=${progress}`);
        console.log(progress);
      }
    });
  });
  mainWindow.webContents.on("context-menu", () => {
    menu.popup();
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
