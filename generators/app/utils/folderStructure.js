// Base Folder Structure
/*   This structure is based on the Screaming Architecture principles, it decouples the domain logic from the infrastructure and UI concerns, allowing for a more maintainable and scalable codebase. */
module.exports = function folderStructure(generator) {
  // Only create folders that don't have .gitkeep files in templates
  // Template .gitkeep files handle: src/features, src/shared/infrastructure, src/shared/ui/components, src/shared/types, src/assets
  const folders = [
    'public', // Only public and tests need .gitkeep files created dynamically
    'tests',
  ];

  folders.forEach((folder) => {
    generator.fs.write(generator.destinationPath(`${folder}/.gitkeep`), '');
  });
};
