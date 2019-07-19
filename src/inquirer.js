const inquirer = require("inquirer");

module.exports = {
	askProjectDetails: () => {
		const questions = [
			{
				name: "name",
				type: "input",
				message: "Enter the name of your project:",
				validate: function(value) {
					if (value.length) {
						return true;
					} else {
						return "Your project name cannot be blank.";
					}
				}
			},
			{
				name: "template",
				type: "list",
				message: "What template do you want to use?",
				choices: [
					{
						value: "react-redux-typescript",
						name: "React Redux TypeScript"
					},
					{
						value: "express-typescript-api",
						name: "Express TypeScript API"
					}
				],
				default: ["react-redux-typescript"]
			},
			{
				name: "vsc",
				type: "confirm",
				message:
					"Do you want to open your new project in Visual Studio Code?"
			}
		];

		return inquirer.prompt(questions);
	}
};
