import { ipcRenderer } from 'electron';
import jQuery from 'jquery';
import 'popper.js';
import 'bootstrap';
import moment from 'moment';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.css';
import '../index.scss';

//initial
window.$ = window.jQuery = jQuery;

$(document).ready(function() {
	//controller
	$('#input-path').on('click', function(){
		$(this).next('.custom-file-label').removeClass('border-danger');

		let filename = ipcRenderer.sendSync('input-path-click', $(this).val());
		if(filename !== undefined) {
			$('#input-path').val(filename);
			$('#input-path').next('.custom-file-label').html(filename);
		}
	});

	$('#input-path')[0].ondrop = function(e) {
		e.stopPropagation();
		e.preventDefault();
		let filename = e.dataTransfer.files[0].path;
		if(filename !== undefined) {
			$('#input-path').val(filename);
			$('#input-path').next('.custom-file-label').html(filename);
		}
	};

	$('#output-dir-path').on('click', function() {
		$(this).next('.custom-file-label').removeClass('border-danger');

		let dirname = ipcRenderer.sendSync('output-dir-path-click', $(this).val());
		if(dirname !== undefined) {
			$(this).val(dirname);
			$(this).next('.custom-file-label').html(dirname);
		}
	});

	$('#folder-btn').on('click', function() {
		$(this).next('.custom-file-label').removeClass('border-danger');

		let valid = ipcRenderer.sendSync('folder-btn-click', $('#output-dir-path').val());
		if(!valid) {
			$('#output-dir-path').next('.custom-file-label').addClass('border-danger');
		}
	});

	if($('#suffix-select').val() === 'Custom') {
		$('#suffix').show();
	} else {
		$('#suffix').hide();
	}
	$('#suffix-select').on('change', function() {
		if($(this).val() === 'Custom') {
			$('#suffix').show();
		} else {
			$('#suffix').hide();
		}
	});

	$('#settings').on('change', function() {
		if(!$('#settings').is(':checked')) {
			ipcRenderer.invoke('clear-data').then(() => {
				$('#output-msg').html('The saved settings are deleted');
				$('#msg-modal').modal('show');
			});
		}
	});

	$('#generate').on('click', function() {
		let input = $('#input-path').val();
		let outputDir = $('#output-dir-path').val();
		let filename = 'data dictionary';
		if($('#suffix-select').val() === 'Custom') {
			filename = filename + '_' + $('#suffix').val().trim();
		} else {
			filename = filename + '_' + moment().format('YYYYMMDD-HHmmss');
		}

		let response = ipcRenderer.sendSync('generate-click', input, outputDir, filename);
		if(response.done) {
			$('#output-msg').html('Data dictionary generated at: ' + response.writepath);
			$('#msg-modal').modal('show');

			if($('#settings').is(':checked')) {
				let data = {
					inputPath: $('#input-path').val(),
					outputDirPath: $('#output-dir-path').val(),
					suffixSelect: $('#suffix-select').val(),
					suffix: $('#suffix').val().trim()
				};
				ipcRenderer.invoke('save-data', data);
			}
		} else {
			if(!response.check.input) {
				$('#input-path').next('.custom-file-label').addClass('border-danger');
			}
			if(!response.check.outputDir) {
				$('#output-dir-path').next('.custom-file-label').addClass('border-danger');
			}
		}
	});

	ipcRenderer.invoke('get-data').then((res) => {
		if(res.inputPath !== undefined) {
			$('#input-path').val(res.inputPath);
			$('#input-path').next('.custom-file-label').html(res.inputPath);
		}
		if(res.outputDirPath !== undefined) {
			$('#output-dir-path').val(res.outputDirPath);
			$('#output-dir-path').next('.custom-file-label').html(res.outputDirPath);
		}
		if(res.suffixSelect !== undefined) {
			$('#suffix-select').val(res.suffixSelect).change();
		}
		if(res.suffix !== undefined) {
			$('#suffix').val(res.suffix);
		}
		if(res.settings !== undefined) {
			$('#settings').prop('checked', res.settings);
		}

		$('#loading').hide();
	});
});