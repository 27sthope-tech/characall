const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // New Candybar Y2K Jelly Phone aspect ratio is 520 / 1480 (~0.3514)
  // Optimal height fitting nicely inside display work area
  const winHeight = Math.min(870, Math.floor(height * 0.94));
  const phoneWidth = Math.round(winHeight * (520 / 1480));
  // Add 40px padding for anti-aliasing and drop shadow
  const winWidth = phoneWidth + 40;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: width - winWidth - 40, // place on right side of desktop
    y: Math.max(10, Math.floor((height - winHeight) / 2)),
    frame: false,             // Frameless: removes square titlebar and borders
    transparent: true,       // Transparent: cuts out around the phone shape!
    backgroundColor: '#00000000', // Fully transparent alpha
    hasShadow: false,        // Disable OS rectangular shadow box (CSS shadow outlines the phone)
    resizable: false,
    alwaysOnTop: true,       // Float on top of other windows as a desktop companion
    skipTaskbar: false,
    title: "CharaCall [Desktop Cutout]",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Window control IPC handlers
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-close', () => {
    app.quit();
  });

  ipcMain.on('window-toggle-ontop', (event) => {
    if (mainWindow) {
      const isTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isTop);
      event.reply('window-ontop-changed', !isTop);
    }
  });

  // Dynamic window resizing with aspect ratio locked (520:1480)
  ipcMain.on('window-set-height', (event, targetHeight) => {
    if (!mainWindow) return;
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const minH = 430;
    const maxH = Math.min(1150, Math.floor(height * 0.98));
    const finalH = Math.max(minH, Math.min(maxH, Math.round(targetHeight)));
    const phoneWidth = Math.round(finalH * (520 / 1480));
    const winWidth = phoneWidth + 40;

    const bounds = mainWindow.getBounds();
    const deltaW = winWidth - bounds.width;
    let newX = bounds.x - Math.round(deltaW / 2);
    let newY = bounds.y;

    if (newX + winWidth > width) newX = Math.max(0, width - winWidth - 10);
    if (newX < 0) newX = 10;
    if (newY + finalH > height) newY = Math.max(0, height - finalH - 10);
    if (newY < 0) newY = 10;

    mainWindow.setBounds({
      x: newX,
      y: newY,
      width: winWidth,
      height: finalH
    });
    event.reply('window-size-changed', { width: winWidth, height: finalH });
  });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
