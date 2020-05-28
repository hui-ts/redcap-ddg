require('v8-compile-cache');
const path = require('path');
const { app, BrowserWindow, Menu} = require('electron');
require('./controller/ipc.js');

let win;

function createWindow () {
	Menu.setApplicationMenu(null);

	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});
	//win.webContents.openDevTools({detached: true});
	win.loadFile(path.join(__dirname, '../../bundle/index.html'));
	win.on('closed', () => {
		win = null
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});