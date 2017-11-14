const fs = require('fs');
const chalk = require('chalk');
const tplJson = require(`${__dirname}/../template.json`);

module.exports = function() {
	let dataString = '\n';
	let count = 0;
	Object.keys(tplJson).forEach((item) => {
		count++;
		let tplData = tplJson[item];
		dataString += chalk.yellow('  ★') + '  ' + chalk.yellow(tplData.name);
		dataString += ' - ' + tplData.description + ' - ';
		dataString += chalk.green(`模板来源为${tplData.source}`) + '\n';
	})
	if (count == 0) {
		dataString += chalk.green('  当前没有模板数据') + '\n';
		console.log(dataString);
	} else {
		console.log(dataString);
	}
}