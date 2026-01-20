const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function findIndexHtml(startPath) {
    if (!fs.existsSync(startPath)) return null;
    const files = fs.readdirSync(startPath);
    
    // 1. On cherche index.html dans le dossier actuel
    if (files.includes('index.html')) return path.join(startPath, 'index.html');
    
    // 2. Sinon, on cherche dans les sous-dossiers (comme GenCodeBarre-main)
    for (const file of files) {
        const fullPath = path.join(startPath, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            const found = findIndexHtml(fullPath);
            if (found) return found;
        }
    }
    return null;
}

function createWindow () {
  const win = new BrowserWindow({ 
    width: 1000, 
    height: 800,
    webPreferences: { nodeIntegration: true }
  })

  const indexPath = findIndexHtml(path.join(__dirname, 'src'));
  
  if (indexPath) {
    win.loadFile(indexPath);
  } else {
    win.loadURL('data:text/html,<h1>Erreur : index.html introuvable dans le dossier src</h1>');
  }
}

app.whenReady().then(createWindow)
