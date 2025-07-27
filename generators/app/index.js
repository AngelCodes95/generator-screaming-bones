const Generator = require('yeoman-generator').default;
const askProjectQuestions = require('./prompts');
const setupTailwind = require('./utils/setupTailwind');
const folderStructure = require('./utils/folderStructure');

// Generator for React + TypeScript projects with Screaming Architecture
// Focuses on domain-driven folder structure and modern toolchain
module.exports = class screamingBones extends Generator {
  constructor(args, opts) {
    super(args, opts);
    // Maintain compatibility with legacy Yeoman generators
    this.option('babel');
  }

  async prompting() {
    try {
      this.answers = await askProjectQuestions(this);
    } catch (error) {
      this.log('Error during project setup:', error.message);
      throw error;
    }
  }

  writing() {
    try {
      // Generate core project files with user context
      this.fs.copyTpl(this.templatePath('README.md.ejs'), this.destinationPath('README.md'), {
        appName: this.answers.appName,
      });

      this.fs.copyTpl(this.templatePath('package.json.ejs'), this.destinationPath('package.json'), {
        appName: this.answers.appName,
      });

      // Dual TypeScript configs: app code vs build tooling
      // Prevents build tool types from polluting application code
      this.fs.copy(this.templatePath('tsconfig.json.ejs'), this.destinationPath('tsconfig.json'));

      this.fs.copy(
        this.templatePath('tsconfig.node.json.ejs'),
        this.destinationPath('tsconfig.node.json')
      );

      // Modern ESLint flat config with React + TypeScript support
      this.fs.copy(
        this.templatePath('eslint.config.js.ejs'),
        this.destinationPath('eslint.config.js')
      );

      // Prettier config with ESLint integration (no rule conflicts)
      this.fs.copy(this.templatePath('.prettierrc.ejs'), this.destinationPath('.prettierrc'));

      // Conditional feature: only add Tailwind overhead when requested
      if (this.answers.useTailwind) {
        setupTailwind(this);
      }

      this.fs.copyTpl(
        this.templatePath('vite.config.js.ejs'),
        this.destinationPath('vite.config.js'),
        this.answers
      );

      // Creates base folder structure
      folderStructure(this);

      // creates a .gitignore file
      this.fs.copy(this.templatePath('gitignore.ejs'), this.destinationPath('.gitignore'));

      // copies the main entry point
      this.fs.copyTpl(this.templatePath('index.html.ejs'), this.destinationPath('index.html'), {
        appName: this.answers.appName,
      });

      // Add Vite logo
      this.fs.copy(this.templatePath('public/vite.svg'), this.destinationPath('public/vite.svg'));

      // Add React logo
      this.fs.copy(
        this.templatePath('src/assets/react.svg'),
        this.destinationPath('src/assets/react.svg')
      );

      this.fs.copy(
        this.templatePath('src/shared/ui/styles/reset.css'),
        this.destinationPath('src/shared/ui/styles/reset.css')
      );

      // Always copy index.css with proper Tailwind conditionals
      this.fs.copyTpl(
        this.templatePath('src/index.css.ejs'),
        this.destinationPath('src/index.css'),
        this.answers
      );

      // copies the main entry point for the React app
      this.fs.copyTpl(
        this.templatePath('src/main.tsx.ejs'),
        this.destinationPath('src/main.tsx'),
        this.answers
      );

      // copies the App component
      this.fs.copyTpl(
        this.templatePath('src/App.tsx.ejs'),
        this.destinationPath('src/App.tsx'),
        this.answers
      );

      // copies App.css
      this.fs.copyTpl(
        this.templatePath('src/App.css.ejs'),
        this.destinationPath('src/App.css'),
        this.answers
      );
    } catch (error) {
      this.log('Error during file generation:', error.message);
      this.log('Please check file permissions and available disk space.');
      throw error;
    }
  }

  install() {
    // Optional Git initialization with graceful failure handling
    if (this.answers.initGit) {
      try {
        const fs = require('fs');
        const path = require('path');
        const gitDir = path.join(this.destinationPath(), '.git');

        // Avoid reinitializing existing repositories
        if (fs.existsSync(gitDir)) {
          this.log('Git repository already exists, skipping initialization.');
          return;
        }

        this.spawnCommandSync('git', ['init'], {
          cwd: this.destinationPath(),
          stdio: 'pipe',
        });

        // Verify operation success by checking filesystem result
        if (fs.existsSync(gitDir)) {
          this.log('Git repository initialized successfully.');
        } else {
          this.log('Warning: Git initialization failed. You can run "git init" manually later.');
        }
      } catch (error) {
        // Graceful degradation: core functionality works even if Git fails
        this.log(
          'Warning: Git not found or failed to initialize. Make sure Git is installed and try "git init" manually.'
        );
      }
    }
  }

  end() {
    this.log(
      'Project scaffold complete! You now have the Bones of a Screaming Architecture project.'
    );
    this.log('Start development with `npm run dev` (hot reload enabled)');
    this.log('For production: `npm run build` then `npm run preview`');
    this.log(
      'Be sure to double check all your files, add your own env variables, and update your README.md.'
    );
  }
};
