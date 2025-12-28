const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Example: Confirm before performing dangerous actions from renderer
ipcMain.handle('confirm-action', async (_, { title, message }) => {
  const res = await dialog.showMessageBox({
    type: 'warning',
    buttons: ['Yes', 'No'],
    defaultId: 1,
    title,
    message
  });
  return res.response === 0;
});
