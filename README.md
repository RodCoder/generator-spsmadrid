# generator-spsspfx - Sample to demonstrate how to generate a starter template extending spfx

This sample generator performs the following actions:
* Apply custom config (replaces gulp file)
* Adds webpart bundles and strings location to the existing config file
* Copies models, services, utils, webparts and tslint files to the new project's location
* Installs PnP.js, PnP React Controls and PnP Property Controls npm packages

## Installation

```sh
# Clone repository
git clone https://github.com/RodCoder/SPS-Generator.git

# Switch to the repositories directory
cd generatore-spsspfx

# Create a global symlink to appear as a global npm package
npm link
```

The generator is not published on NPM. The only way to use and install it is through cloning the repository and link the local files in the global npm cache.
In general this generator should only be used to configure new projects after the configuration has once been provisioned `@microsoft/sharepoint` should be used.

## Usage

This generator is 100% based on @microsoft/generator-sharepoint and supports two different scenarios:

* SPFx template pre-configured with models, services, utils and npm packages
* Optional installation of webparts

The basic usage is to start a new project through:

```sh
yo spsspfx
```

![https://github.com/RodCoder/Generator-spsmadrid/blob/master/assets/init-generator.png](https://github.com/RodCoder/Generator-spsmadrid/blob/master/assets/init-generator.png)



