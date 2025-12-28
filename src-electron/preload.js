const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  confirmAction: (opts) => ipcRenderer.invoke('confirm-action', opts),
  readLocalConfig: () => {
    const cfgPath = path.join(process.cwd(), 'config', 'local.json');
    try {
      const raw = fs.readFileSync(cfgPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }
});
