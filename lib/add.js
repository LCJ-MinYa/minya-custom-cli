const fs = require('fs');
const path = require('path');
const tplPath = path.resolve(__dirname, '../template.json');
const tplJson = require(tplPath);
const chalk = require('chalk');
const {
	prompt
} = require('inquirer');

var chooseSource = function(val) {
	return function(answers) {
		return answers[val];
	};
}

const questions = [{
	type: 'input',
	name: 'name',
	message: '模板名称',
	validate: function(val) {
		if (!val) {
			return '模板名称不能为空';
		} else if (val == 'a' || val == 'add' || val == 'i' || val == 'init' || val == 'd' || val == 'delete' || val == 'l' || val == 'list') {
			return '模版名称不能为关键字';
		} else {
			return true;
		}
	}
}, {
	type: 'input',
	name: 'description',
	message: '模板描述',
	validate: function(val) {
		if (!val) {
			return '模板描述不能为空';
		} else {
			return true;
		}
	}
}, {
	type: 'list',
	name: 'templateSource',
	message: '模板文件来源',
	default: 'git',
	choices: ['git', 'npm'],
	validate: function(val) {
		if (!val) {
			return '模板名称不能为空';
		} else {
			return true;
		}
	}
}];

const npmQuestions = [{
	type: 'input',
	name: 'npm',
	message: '模板包名称，（ps: 创建项目使用的npm包）',
	validate: function(val) {
		if (!val) {
			return '模板包名称不能为空';
		} else {
			return true;
		}
	}
}];

const gitQuestions = [{
	type: 'input',
	name: 'git',
	message: '模板git地址，（ps: 创建项目使用的git地址）',
	validate: function(val) {
		if (!val) {
			return '模板git地址不能为空';
		} else if (val && val.indexOf('https://github.com/') > -1) {
			return true;
		} else {
			return '请输入正确的git地址';
		}
	}
}];

module.exports = function() {
	prompt(questions).then(function(data) {
		tplJson[data.name] = {};
		tplJson[data.name]['name'] = data.name;
		tplJson[data.name]['description'] = data.description;

		if (data.templateSource == 'git') {
			prompt(gitQuestions).then(function(gitData) {
				tplJson[data.name]['source'] = gitData.git;
				writeTplFile(tplJson);
			})
		} else {
			prompt(npmQuestions).then(function(npmData) {
				tplJson[data.name]['source'] = npmData.npm;
				writeTplFile(tplJson);
			})
		}
	});

	//写入模版文件
	function writeTplFile(tplJson) {
		fs.writeFile(tplPath, JSON.stringify(tplJson), 'utf-8', function(err, data) {
			if (err) {
				console.log(chalk.red('  模板添加失败'));
			}
			console.log(chalk.green('  模板添加成功'));
		});
	}
};