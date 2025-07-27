// Tailwind Setup for Screaming Bones
module.exports = function setupTailwind(generator) {
  generator.fs.copyTpl(
    generator.templatePath('tailwind.config.js.ejs'),
    generator.destinationPath('tailwind.config.js')
  );
  generator.fs.copyTpl(
    generator.templatePath('postcss.config.js.ejs'),
    generator.destinationPath('postcss.config.js')
  );

  // Extend package.json for Tailwind dependencies only
  // Scripts are already defined in the base package.json template
  const pkgJson = {
    devDependencies: {
      tailwindcss: '^3.4.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0',
    },
  };
  generator.fs.extendJSON(generator.destinationPath('package.json'), pkgJson);
};
