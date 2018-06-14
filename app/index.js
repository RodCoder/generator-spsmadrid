'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require("path");
const fs = require('fs');
const commandExists = require('command-exists').sync;

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    // Initialisation Generator + SPFx generator
    initializing() {
        this.log(yosay(
            chalk.white('Welcome to SPS Madrid Custom Generator\n') +
            chalk.blue('based on\n') +
            chalk.blue.bold('SharePoint Client-side Solution Generator')
        ));
    }

    // Prompt for user input for Custom Generator
    prompting() {
        const prompts = [{
            type: 'confirm',
            name: 'webparts',
            message: 'Would you like to install the default webparts?'
        }];

        return this.prompt(prompts).then(answers => {
            this.webparts = answers.webparts;

            this.composeWith(
                require.resolve(`@microsoft/generator-sharepoint/lib/generators/app`), {
                    'skip-install': true,
                    'framework': 'react'
                }
            );
        });
    }

    // adds additonal editor support
    configuring() { }

    // not used because of the dependencies of the SPFx file
    // Code was moved to Install
    writing() { }

    install() {
        // Apply Custom configuration (gulp file)
        this._applyCustomConfig();

        // Modify files
        this._editExistingFiles();

        // Copy utils, services, tslint. etc..
        this._copyFiles();

        // Install additional NPM Packages
        this._installNPMPackages();

        // Process install
        this._processInstall();
    }

    // Run installer normally time to say goodbye
    // If yarn is installed yarn will be used
    end() { }

    // Implement Logic

    // Applies gulp and additonal config to project
    _applyCustomConfig() {
        // backup default gulp file;
        fs.renameSync(
            this.destinationPath('gulpfile.js'),
            this.destinationPath('gulpfile.backup.js')
        );

        // Copy custom gulp file to
        this.fs.copy(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );
    }

    // Edit config.json and other necessary files
    _editExistingFiles() {
        // config.json
        let config = this.fs.readJSON(this.destinationPath('config/config.json'));

        // Add Property controls
        config.localizedResources.PropertyControlStrings = "./node_modules/@pnp/spfx-property-controls/lib/loc/{locale}.js";
        // Add controls
        config.localizedResources.ControlStrings = "./node_modules/@pnp/spfx-controls-react/lib/loc/{locale}.js";

        // In case the user has chosen to install webparts
        if (this.webparts) {
            // Add bundle entries
            // PnP Controls
            config.bundles["pnp-controls-web-part"] = {
                "components": [{
                    "entrypoint": "./lib/webparts/pnpControls/PnPControlsWebPart.js",
                    "manifest": "./src/webparts/pnpControls/PnPControlsWebPart.manifest.json"
                }]
            }

            // Add ControlStrings
            config.localizedResources.PnPControlsWebPartStrings = "lib/webparts/pnpControls/loc/{locale}.js";
        }

        // writing json
        fs.writeFileSync(
            this.destinationPath('config/config.json'),
            JSON.stringify(config, null, 2));
    }

    // Adds the base files
    _copyFiles() {
        // Models
        this.fs.copy(
            this.templatePath('src/models/'),
            this.destinationPath('src/models/')
        )

        // Services
        this.fs.copy(
            this.templatePath('src/services/'),
            this.destinationPath('src/services/')
        );

        // Utils
        this.fs.copy(
            this.templatePath('src/utils/'),
            this.destinationPath('src/utils/')
        )

        // TS Lint
        this.fs.copy(
            this.templatePath('tslint.json'),
            this.destinationPath('tslint.json')
        )

        // PnP Controls
        // In case the user has chosen to install webparts
        if (this.webparts) {
            this.fs.copy(
                this.templatePath('src/webparts/'),
                this.destinationPath('src/webparts/')
            )
        }
    }

    // install additional NPM packages for PnP.js, reusable controls and property controls
    _installNPMPackages() {

        var done = this.async();

        // PnP.js (SP only)
        this.npmInstall(['install',
            '@pnp/logging'
        ], [
                '--save'
            ]);

        this.npmInstall(['install',
            '@pnp/common'
        ], [
                '--save'
            ]);

        this.npmInstall(['install',
            '@pnp/odata'
        ], [
                '--save'
            ]);

        this.npmInstall(['install',
            '@pnp/sp'
        ], [
                '--save'
            ]);

        // PnP Reusable Controls --> this need the config.json to be updated
        this.npmInstall(
            [
                'install',
                '@pnp/spfx-controls-react',
            ], [
                '--save',
                '--save-exact'
            ]);

        // PnP Property Controls
        this.npmInstall(
            [
                'install',
                '@pnp/spfx-property-controls',
            ], [
                '--save',
                '--save-exact'
            ]);

        // spsync
        this.npmInstall(
            [
                'install',
                'gulp-spsync-creds',
            ], [
                '--save-dev',
                '--save-exact'
            ]);

        done();
    }

    _processInstall() {
        console.log('Process Install');

        const hasYarn = commandExists('yarn');

        this.installDependencies({
            npm: !hasYarn,
            bower: false,
            yarn: hasYarn,
            skipMessage: this.options['skip-install-message'],
            skipInstall: this.options['skip-install']
        });
    }
}