//scwastartup <=> sc wa startup <=> splash screen workaround startup
const fs = require('fs');
const path = require('path');

let file;
let backup;
let txt;

//modify portable.nsi
file = path.resolve('node_modules/app-builder-lib/templates/nsis/portable.nsi');
backup = path.resolve('node_modules/app-builder-lib/templates/nsis/portable_backup.nsi');
if(fs.existsSync(backup)) {
	fs.copyFileSync(backup, file);
}
fs.copyFileSync(file, backup);
txt = fs.readFileSync(file, 'utf8')
	.replace('  SetSilent silent', "  !ifndef SPLASH_IMAGE\n    SetSilent silent\n  !endif");
fs.writeFileSync(file, txt);

//modify NsisTarget.js
file = path.resolve('node_modules/app-builder-lib/out/targets/nsis/NsisTarget.js');
backup = path.resolve('node_modules/app-builder-lib/out/targets/nsis/NsisTarget_backup.js');
if(fs.existsSync(backup)) {
	fs.copyFileSync(backup, file);
}
fs.copyFileSync(file, backup);
txt = fs.readFileSync(file, 'utf8')
	.replace('defines.SPLASH_IMAGE = portableOptions.splashImage;', "defines.SPLASH_IMAGE = path.resolve(packager.projectDir, portableOptions.splashImage);");
fs.writeFileSync(file, txt);

console.log('Workaround: electron builder files have been modified for splash image.')