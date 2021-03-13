// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    // Default directory for the build output
    buildDir: './dist',
    // Default bundler
    bundler: 'rollup',
    // Default mode for build command
    mode: 'development',
    // Clears the build directory on every build
    noclear: false,
    sourceDir: './src/view',
    resources: [
        { from: 'src/view/resources/**', to: 'dist/resources' },
        { from: 'node_modules/@salesforce-ux/design-system/assets/**', to: 'dist/resources/slds' },

        { from: 'src/view/index.html', to: 'dist/' },
        { from: 'src/manifest.json', to: 'dist/' }
    ]
};
