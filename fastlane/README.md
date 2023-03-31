fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```



### ios deploy

```sh
[bundle exec] fastlane ios deploy
```



----


## Android

### android prepare_keystore

```sh
[bundle exec] fastlane android prepare_keystore
```



### android prepare_playstore_key

```sh
[bundle exec] fastlane android prepare_playstore_key
```



### android clean

```sh
[bundle exec] fastlane android clean
```



### android signing_report

```sh
[bundle exec] fastlane android signing_report
```



### android build_apk

```sh
[bundle exec] fastlane android build_apk
```



### android build_bundle

```sh
[bundle exec] fastlane android build_bundle
```



### android deploy_bundle

```sh
[bundle exec] fastlane android deploy_bundle
```



----


## common

### common populate_github_env

```sh
[bundle exec] fastlane common populate_github_env
```



### common write_env_file

```sh
[bundle exec] fastlane common write_env_file
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
