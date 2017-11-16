const chalk = require('chalk');
const path = require('path');
const tplPath = path.resolve(__dirname, '../template.json');
const tplJson = require(tplPath);
const ora = require('ora');
const exec = require('child_process').exec;
const Metalsmith = require('metalsmith');
const {
	prompt
} = require('inquirer');

const questions = [{
	type: 'input',
	name: 'name',
	message: '请输入您要初始化的模版名称',
	validate: function(val) {
		if (!val) {
			return '模板名称不能为空';
		} else {
			return true;
		}
	}
}];

module.exports = function(name, fileName) {
	if (typeof(name) == 'object') {
		prompt(questions).then(function(data) {
			isNpmOrGit(data.name, fileName);
		});
	} else {
		isNpmOrGit(name, fileName);
	}

	//判断初始化来源是git还是npm包
	function isNpmOrGit(name, fileName) {
		if (tplJson[name] != undefined) {
			if (tplJson[name].source.indexOf('https://github.com/') > -1) {
				initGit(tplJson[name], fileName);
			} else {
				initNpm(tplJson[name], fileName);
			}
		} else {
			console.log(chalk.red(' 您要初始化的模版不存在') + '\n');
		}
	}

	//npm包初始化方法
	function initNpm(data, fileName) {
		console.log(chalk.yellow(`  使用模板${data.name}创建项目`));
		const spinner = ora('  正在下载模板');
		spinner.start();

		//下载模板到本地
		exec(`npm i ${data.source}`, (err, result) => {
			//停止加载动画
			spinner.stop();

			//监听exit进程,当推出的时候删除当前进程的根目录下/node_modules文件
			process.on('exit', () => {
				exec(`rm -rf ${process.cwd()}/node_modules && rm package-lock.json`);
			})

			if (err) {
				console.log(chalk.red('  模板下载失败!'));
			}

			const tplFilePath = `${process.cwd()}/node_modules/${data.source}`;
			let projectPath = '';
			if (typeof(fileName) == 'string') {
				projectPath = `${process.cwd()}/${fileName}`;
			} else {
				projectPath = `${process.cwd()}/${data.source}`;
			}

			//生成新项目
			Metalsmith(`${tplFilePath}`)
				.source('.')
				.destination(`${projectPath}`)
				.build(function(err) {
					if (err) {
						console.log(chalk.red('项目生成失败', err));
					}
					console.log(chalk.green(' \n 项目已创建'));
				})
		})
	}

	//git初始化方法
	function initGit(data, fileName) {
		console.log(chalk.yellow(`  使用模板${data.name}创建项目`));
		const spinner = ora('  正在下载模板');
		spinner.start();

		let projectPath = '';
		if (typeof(fileName) == 'string') {
			projectPath = fileName;
		} else {
			projectPath = `${process.cwd()}/${data.source}`;
		}

		// git命令，远程拉取项目并自定义项目名
		const cmdStr = `git clone ${data.source} ${typeof(fileName) == 'string' ? fileName : data.name}`;
		exec(cmdStr, (err, result) => {
			spinner.stop();
			if (err) {
				console.log(chalk.red('  模板下载失败!', err));
				process.exit();
			}

			console.log(chalk.green(' \n 项目已创建'));
			process.exit();
		})
	}
}