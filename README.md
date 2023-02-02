# Desmos Flagship Project
* name TBC

## Quickstart

1. Clone this repo
2. Install dependencies with `yarn`
3. Copy `.env.sample` into `.env` **Do not add to git**
4. Run ios or android with `yarn ios` or `yarn android`

## Storybook
To run the application in storybook mode:
1. `yarn use:storybook`
2. If you encounter a `storyloader.js not found error`, run `yarn prestorybook` to generate stories.
3. `yarn ios` or `yarn android`

To run the application in regular mode:
1. `yarn use:main`
2. `yarn ios` or `yarn android`

## Detox
As of FEB 2 2023, detox is only supported on `ios`.
1. Install the following [prerequisite](https://wix.github.io/Detox/docs/introduction/getting-started/#2-macos-only-applesimutils):
2. `yarn detox:build-ios`
3. `yarn detox:test-ios`
