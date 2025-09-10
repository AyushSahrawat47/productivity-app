const { Tray, Menu } = require('electron');
const path = require('path');

function createTray(mainWindow, app) {
  const tray = new Tray(path.join(__dirname, 'assets/icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Productivity App');
  tray.setContextMenu(contextMenu);
  return tray;
}

module.exports = { createTray };
