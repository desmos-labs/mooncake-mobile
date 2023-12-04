# Butter

<p align="center">
  <a href="https://github.com/desmos-labs/butter-mobile">
    <img width="150" src="./butter_logo_1.svg" alt="Butter logo" />
  </a>
</p>

[Butter](https://github.com/desmos-labs/butter-mobile) serves as the official client showcase for Desmos and
permissionless social microblogging app. By utilizing Butter, you gain a functional illustration of the seamless
integration of any Desmos module into a mobile application. Additionally, it effectively demonstrates the practical
application of each of Desmos' individual tools within this specific context.

## Development

### Required env files

In order to properly build Butter you will need to first setup your environment files.

First, you need to setup the `.prebuild.env` file. To do so:

1. Create the new file using the `.prebuild.env.sample` file as the template:
   ```
   cp .prebuild.env.sample .prebuild.env
   ```
2. Fill out the required information inside the new `.prebuild.env` file.

Second, you need to setup the `.env` file:

1. Create the file by using the `.env.sample` file as the template:
   ```
   cp .env.sample .env
   ```
2. Fill out the required information inside the new `.env` file.

### Running the app

Once you have your environment properly setup, you can run the application by using the following commands:

1. Running the prebuild script:
   ```
   yarn prebuild
   ```
2. Installing the Android or iOS version:
   ```
   yarn install <android/ios>
   ```
3. Running the Metro server:
   ```
   yarn start
   ```
