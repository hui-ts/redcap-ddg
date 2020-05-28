//scwacleanup <=> sc wa cleanup <=> splash screen workaround cleanup
const fs = require('fs');
const path = require('path');

let file;
let backup;
let txt;

//restore portable.nsi
file = path.resolve('node_modules/app-builder-lib/templates/nsis/portable.nsi');
backup = path.resolve('node_modules/app-builder-lib/templates/nsis/portable_backup.nsi');
if(fs.existsSync(backup)) {
	fs.copyFileSync(backup, file);
	fs.unlinkSync(backup);
}

//restore NsisTarget.js
file = path.resolve('node_modules/app-builder-lib/out/targets/nsis/NsisTarget.js');
backup = path.resolve('node_modules/app-builder-lib/out/targets/nsis/NsisTarget_backup.js');
if(fs.existsSync(backup)) {
	fs.copyFileSync(backup, file);
	fs.unlinkSync(backup);
}

console.log('Workaround: electron builder files have been stored from the modification for splash image');