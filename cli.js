#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const fs = require("fs");
const shell = require("shelljs");
const ora = require("ora");
const rimraf = require("rimraf");

const inquirer = require("./src/inquirer");
const repositories = require("./src/repositories");

clear();

const run = async () => {
	const currentDirectory = process.cwd();
	const answer = await inquirer.askProjectDetails();
	const cloningStatus = ora("Cloning project...").start();

	try {
		const newDirectory = `${currentDirectory}/${answer.name}`;
		const gitUrl = repositories.getRepositories()[answer.template];

		if (!shell.which("git")) {
			cloningStatus.fail("This script requires Git to be installed.");
			process.exit(1);
		}

		if (fs.existsSync(newDirectory)) {
			cloningStatus.fail("A folder with the specified name already exists.");
			process.exit(1);
		}

		if (!gitUrl) {
			cloningStatus.fail("Something went wrong.");
			process.exit(1);
		}

		shell.exec(`git clone ${gitUrl} ${answer.name}`, { silent: true });
		cloningStatus.succeed("Successfully cloned template");

		const gitStatus = ora("Initializing git...").start();

		rimraf.sync(`${newDirectory}/.git`);
		shell.exec(`cd ${newDirectory} && git init`, { silent: true });
		gitStatus.succeed("Initialized git repository");

		npmInstallStatus = ora("Installing dependencies...").start();
		shell.exec("npm i");
		npmInstallStatus.succeed("Installed dependencies.");

		if (shell.which("code") && answer.vsc) {
			const vscStatus = ora("Opening new project in Visual Studio Code...").start();

			shell.exec(`code ${newDirectory}`);
			vscStatus.succeed("Opened new project in Visual Studio Code.");
		}

		console.log("\n");
		console.log(
			chalk.green("The project has been successfully created, run the following commands to get started:")
		);
		console.log(chalk.blue("cd "), answer.name);
		console.log(chalk.blue("npm "), "start");

		process.exit();
	} catch (error) {
		cloningStatus.fail("Something went wrong.");
		process.exit(1);
	}
};

run();
