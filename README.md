# Butter
<p align="center">
  <a href="https://github.com/osmosis-labs/osmojs">
    <img width="150" src="https://raw.githubusercontent.com/desmos-labs/butter-mobile/main/butter_logo_1.svg?token=GHSAT0AAAAAACEOOTDAPCLZ3TKYWOAFJAGQZGSINVA">
  </a>
</p>

[Butter](https://github.com/desmos-labs/butter-mobile) serves as the official client showcase for Desmos and permissionless social microblogging app. By utilizing Butter, you gain a functional illustration of the seamless integration of any Desmos module into a mobile application. Additionally, it effectively demonstrates the practical application of each of Desmos' individual tools within this specific context.

---

## Test 

You can test the app by downloading it from:
1. [Testflight (iOS)]()
2. [Google Play Store (Android)]() 

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
2.  Copy `detox.env.sample.ts` into `detox.env.ts` **Do not add to git**
3. `yarn detox:build-ios`
4. `yarn detox:test-ios`
