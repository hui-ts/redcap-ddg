const XLSX = require('xlsx');
const fs = require('fs');

let heading = (text) => {
	return '<div style="color:#0000A0; font-size: 120%; font-weight: bold">' + text.trim() + '</div>';
};

let subheading = (text) => {
	return '<div style="color:#0000A0; font-size: 100%; font-weight: bold">' + text.trim() + '</div>';
};

let style = (label, style) => {
	return '<div style="' + style + '">' + label + '</div>';
};

let createRow = () => {
	return {
		'Variable / Field Name': '',
		'Form Name': '',
		'Section Header': '',
		'Field Type': '',
		'Field Label': '',
		'Choices, Calculations, OR Slider Labels': '',
		'Field Note': '',
		'Text Validation Type OR Show Slider Number': '',
		'Text Validation Min': '',
		'Text Validation Max': '',
		'Identifier?': '',
		'Branching Logic (Show field only if...)': '',
		'Required Field?': '',
		'Custom Alignment': '',
		'Question Number (surveys only)': '',
		'Matrix Group Name': '',
		'Matrix Ranking?': '',
		'Field Annotation': ''
	};
};

let transformToJson = function(filepath) {
	let wb = XLSX.readFile(filepath);
	let ws = wb.Sheets['spec']
	let spec = XLSX.utils.sheet_to_json(ws, {defval: ''});
	
	let dict = [];
	let newSection = false;
	for(let i = 0; i < spec.length; i++) {
		let row = createRow();

		if(newSection) {
			if(spec[i-1]['Data Type'] === 'Heading') {
				row['Section Header'] = heading(spec[i-1]['Label']);
			} else if(spec[i-1]['Data Type'] === 'Subheading') {
				row['Section Header'] = subheading(spec[i-1]['Label']);
			}
			newSection = true;
		}

		specRow = spec[i];
		if(specRow['Data Type'] === 'Heading' || specRow['Data Type'] === 'Subheading') {
			newSection = true;
			continue;
		} else if(specRow['Data Type'] == 'Text') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Letters') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = specRow['Note'];
			row['Text Validation Type OR Show Slider Number'] = 'alpha_only';
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Paragraph Text') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'notes';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Numeric') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = specRow['Note'];
			row['Text Validation Type OR Show Slider Number'] = 'number';
			row['Text Validation Min'] = specRow['Min'];
			row['Text Validation Max'] = specRow['Max'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Integer') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = specRow['Note'];
			row['Text Validation Type OR Show Slider Number'] = 'integer';
			row['Text Validation Min'] = specRow['Min'];
			row['Text Validation Max'] = specRow['Max'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Date') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = '(DD-MM-YYYY)';
			if(specRow['Note'].trim() !== '') {
				row['Field Note'] = row['Field Note'] + '\n' + specRow['Note'];
			};
			row['Text Validation Type OR Show Slider Number'] = 'date_dmy';
			row['Text Validation Min'] = specRow['Min'];
			row['Text Validation Max'] = specRow['Max'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Datetime') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = '(DD-MM-YYYY HH:MM)';
			if(specRow['Note'].trim() !== '') {
				row['Field Note'] = row['Field Note'] + '\n' + specRow['Note'];
			};
			row['Text Validation Type OR Show Slider Number'] = 'datetime_dmy';
			row['Text Validation Min'] = specRow['Min'];
			row['Text Validation Max'] = specRow['Max'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Time') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'text';
			row['Field Label'] = specRow['Label'];
			row['Field Note'] = '(HH:MM)';
			if(specRow['Note'].trim() !== '') {
				row['Field Note'] = row['Field Note'] + '\n' + specRow['Note'];
			};
			row['Text Validation Type OR Show Slider Number'] = 'time';
			row['Text Validation Min'] = specRow['Min'];
			row['Text Validation Max'] = specRow['Max'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Calculated Field') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'calc';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Drop-down List') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'dropdown';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Drop-down List (AC)') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'dropdown';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Text Validation Type OR Show Slider Number'] = 'autocomplete';
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Radio') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'radio';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Checkboxes') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'checkbox';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			row['Custom Alignment'] = specRow['Alignment'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Descriptive Text') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'descriptive';
			if(specRow['HTML Style'].trim() !== '') {
				row['Field Label'] = style(specRow['Label'], specRow['HTML Style']);
			} else {
				row['Field Label'] = specRow['Label'];
			}
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Field Annotation'] = specRow['Action Tags'];
		} else if(specRow['Data Type'] == 'Slider') {
			row['Variable / Field Name'] = specRow['Variable Name'];
			row['Form Name'] = specRow['Form'];
			row['Field Type'] = 'slider';
			row['Field Label'] = specRow['Label'];
			row['Choices, Calculations, OR Slider Labels'] = specRow['Code List/Formula'];
			row['Field Note'] = specRow['Note'];
			row['Branching Logic (Show field only if...)'] = specRow['Branching Logic'];
			row['Required Field?'] = specRow['Required'];
			if(specRow['Alignment'].trim() !== '') {
				row['Custom Alignment'] = specRow['Alignment'];
			} else {
				row['Custom Alignment'] = 'RH';
			}
			row['Field Annotation'] = specRow['Action Tags'];
		}
		row['Form Name'] = row['Form Name']
			.toLowerCase()
			.replace(/[^_a-zA-Z0-9 ]/g, '')
			.replace(/[ ]+/g, '_')
			.replace(/[ ]+/g, '_')
			.substring(0,50)
			.replace(/_$/g, '');
		dict.push(row);
	}
	return dict;
};

let jsonToCsv = (json) => {
	return XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(json));
};

let writeDict = (csv, filepath) => {
	fs.writeFileSync(filepath, '\ufeff' + csv, {encoding: 'utf8'});
};

module.exports = {
	transformToJson,
	jsonToCsv,
	writeDict
};