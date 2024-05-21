const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            // optionally, configure aliases for module resolution
            // e.g., 'aliases': { '@/*': ['app/*'] }
            "@/*": ["./app/*"],
            diagnostics: {
                exclude: ['**'],
            },
          }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleDirectories: ['node_modules', '<rootDir>'],    
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'})
};