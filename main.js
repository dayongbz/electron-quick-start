const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");

let mainWindow = null;
let tray = null;
let willQuitApp = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true
  });

  mainWindow.loadURL("https://vibe.naver.com/");

  mainWindow.on("close", e => {
    if (willQuitApp) {
      mainWindow = null;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function getWindowPosition() {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );
  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  return { x, y };
}

function showWindow() {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
}

function toggleWindow(e) {
  try {
    mainWindow.isVisible() ? mainWindow.hide() : showWindow();
  } catch (error) {
    createTray();
  }
}

function createTray() {
  tray = new Tray(path.join(__dirname, "vibe_appicon@1.5x.png"));
  tray.on("click", toggleWindow);
}

app.dock.hide();

app.on("ready", () => {
  createWindow();
  createTray();
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("browser-window-blur", () => {
  mainWindow.hide();
});

app.on("before-quit", () => {
  willQuitApp = true;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
