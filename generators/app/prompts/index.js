// Prompts for generating a Screaming Bones project
const chalk = require('chalk');

module.exports = async function askProjectQuestions(generator) {
  // make sure the user is in the correct directory before proceeding
  const { proceed } = await generator.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message:
        'Are you running this command in the directory where you want to start your project?',
      default: true,
    },
  ]);

  if (!proceed) {
    generator.log(
      chalk.yellow(
        "\nNavigate to the directory you'd like your project to live and run the command again.\n"
      )
    );
    process.exit(0);
  }
  // Prompt for project details to generate the scaffolding
  return await generator.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is your project name?',
      default: generator.appname, // fallback: name of directory
      validate: function (input) {
        // Comprehensive npm package name validation for generated package.json
        if (!input || input.trim().length === 0) {
          return 'Project name cannot be empty';
        }

        // Follow npm naming conventions to prevent publish issues
        const npmNameRegex = /^[a-z0-9]([a-z0-9\-._])*$/;
        const normalizedName = input.toLowerCase().replace(/\s+/g, '-');

        if (!npmNameRegex.test(normalizedName)) {
          return 'Project name can only contain lowercase letters, numbers, hyphens, periods, and underscores';
        }

        // Prevent conflicts with core Node.js modules and common directories
        const reservedNames = ['node_modules', 'favicon.ico', 'npm', 'node', 'test', 'src'];
        if (reservedNames.includes(normalizedName)) {
          return `"${normalizedName}" is a reserved name. Please choose a different name`;
        }

        // npm enforced length limit for package names
        if (normalizedName.length > 214) {
          return 'Project name must be less than 214 characters';
        }

        return true;
      },
    },
    {
      type: 'confirm',
      name: 'useTailwind',
      message: 'Would you like to include Tailwind CSS?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Would you like to initialize a Git repository for your project?',
      default: true,
    },
  ]);
};
