const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const tplPath = path.resolve(__dirname, '../template.json');
const tplJson = require(tplPath);
const {
	prompt
} = require('inquirer');

const questions = [{
	type: 'input',
	name: 'name',
	message: '模板名称',
	validate: function (val) {
		if (!val) {
			return '模板名称不能为空';
		} else {
			return true;
		}
	}
}];

module.exports = function (name) {
	if (typeof (name) == 'object') {
		prompt(questions).then(function (data) {
			writeTplFile(data.name);
		});
	} else {
		writeTplFile(name);
	}

	//删除指定模版
	function writeTplFile(name) {
		console.log('\n' + chalk.yellow(` 您要删除的模版名称是: ${name}`));
		if (tplJson[name] != undefined) {
			delete tplJson[name];
			fs.writeFile(tplPath, JSON.stringify(tplJson), 'utf-8', function (err, data) {
				if (err) {
					console.log(chalk.red(' 模板删除失败') + '\n');
				}
				console.log(chalk.green(' 模板删除成功') + '\n');
			});
		} else {
			console.log(chalk.red(' 您要删除的模版不存在') + '\n');
		}
	}
};