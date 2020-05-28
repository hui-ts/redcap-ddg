# REDCap Data Dictionary Genearator

## User
### Related file and application
* eCRF spec template.xlsm  
* REDCap DDG.exe


### Usage
* Configure the eCRF specification data in eCRF spec template.xlsm, which should be used with "Enable Content"
* Use REDCap DDG.exe to generate the data dictionary according to the specification file
* Import the generated data dictionary in REDCap to configure the instrument

## Developer
### Project structure
```
├── src/   <--- source code  
│   └── main/   <--- main process code  
│   │   └── main.js   <--- electron entry point  
│   │   └── ...  
│   └── renderer/   <--- renderer process code  
│       └── index.html   <--- parcel entry point  
│       └── ...  
├── bundle/   <--- bundle built here by parcel  
│   └── index.html   <--- the view that electron   actually calls  
│   └── ...  
├── dist/   <--- electron build output  
├── spec/
│   └── eCRF spec template.xlsm   <--- A template specification file  
├── electron.json   <--- electron builder configuration  
```

### NPM script
devm: reload **m**ain  
devmr: reload **m**ain and **r**enderer  
prod: electron build with workaround for splash screen
