import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('NapCat.Test', {
  greeting: (name: string) => {
    ipcRenderer.send('Greeting', name);
  }
});