const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');
const tf = require('./transform.js');

let store = new Store();

ipcMain.handle('get-data', (e) => {
	if(store.size === 0) {
		return {};
	} else {
		let inputPath = store.get('inputPath');
		let outputDirPath = store.get('outputDirPath');
		let suffixSelect = store.get('suffixSelect');
		let suffix = store.get('suffix');
		let settings = true;
	
		return {
			inputPath,
			outputDirPath,
			suffixSelect,
			suffix,
			settings
		};
	}
});

ipcMain.handle('save-data', (e, data) => {
	store.set('inputPath', data.inputPath);
	store.set('outputDirPath', data.outputDirPath);
	store.set('suffixSelect', data.suffixSelect);
	store.set('suffix', data.suffix);

	return data;
});

ipcMain.handle('clear-data', (e) => {
	store.clear();
	fs.unlinkSync(store.path);
	return store.store;
});

ipcMain.on('input-path-click', (e, currentFilename) => {
	let filenameStr = typeof currentFilename === 'string' ? currentFilename : '';
	pathSplit = path.normalize(filenameStr).split(path.sep);

	let defaultPath = undefined;
	while(pathSplit.length > 0) {
		let testPath = pathSplit.join(path.sep);
		if(fs.existsSync(testPath) && fs.statSync(testPath).isDirectory()) {
			defaultPath = testPath;
			break;
		} else {
			pathSplit.pop();
		}
	}

	let filename = dialog.showOpenDialogSync({
		title: 'Specification File',
		defaultPath: defaultPath,
		filters: [
			{ name: 'Excel files (.xlsx, .xlsm)', extensions: ['xlsx', 'xlsm'] }
		],
		properties: ['openFile']
	});

	e.returnValue = filename;
});

ipcMain.on('output-dir-path-click', (e, currentDirname) => {
	let dirnameStr = typeof currentDirname === 'string' ? currentDirname : '';
	pathSplit = path.normalize(dirnameStr).split(path.sep);

	let defaultPath = undefined;
	while(pathSplit.length > 0) {
		let testPath = pathSplit.join(path.sep);
		if(fs.existsSync(testPath) && fs.statSync(testPath).isDirectory()) {
			defaultPath = testPath;
			break;
		} else {
			pathSplit.pop();
		}
	}

	let dirname = dialog.showOpenDialogSync({
		title: 'Destination Folder',
		defaultPath: defaultPath,
		properties: ['openDirectory']
	});

	e.returnValue = dirname;
});

ipcMain.on('folder-btn-click', (e, currentDirname) => {
	let dirnameStr = typeof currentDirname === 'string' ? currentDirname : '';
	if(fs.existsSync(dirnameStr) && fs.statSync(dirnameStr).isDirectory()) {
		shell.openPath(dirnameStr);
		e.returnValue = true;
	} else {
		e.returnValue = false;
	}
});

ipcMain.on('generate-click', (e, input, outputDir, filename) => {
	let check = {input: true, outputDir: true};
	if(!input.trim().match(/.xls[xm]$/)) {
		check.input = false;
	}
	if(!fs.existsSync(input)) {
		check.input = false;
	}
	if(!fs.existsSync(outputDir)) {
		check.outputDir = false;
	}

	if(Object.keys(check).every((k) => check[k])) {
		let dictJson = tf.transformToJson(input);
		let dictCsv = tf.jsonToCsv(dictJson);
		let writepath = path.join(outputDir, filename + '.csv');
		tf.writeDict(dictCsv, writepath);
		e.returnValue = {done: true, writepath: writepath};
	} else {
		e.returnValue = {done: false, check: check};
	}
});

module.exports = {};