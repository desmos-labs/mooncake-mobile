export default {
  expo: {
    name: 'Butter',
    slug: 'butter',
    owner: 'desmos',
    version: '2.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    notification: {
      icon: './assets/ic_notification.png',
      color: '#FEB027',
    },
    assetBundlePatterns: ['**/*', 'assets/md/*'],
    packagerOpts: {
      assetExts: ['md'],
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'mobile.butter.app',
      infoPlist: {
        NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to use Face ID.',
        FirebaseDynamicLinksCustomDomains: ['https://butter.social'],
        UIBackgroundModes: ['remote-notification'],
      },
      googleServicesFile: './GoogleService-Info.plist',
      associatedDomains: ['applinks:butter.social', 'applinks:bondscape.app.link'],
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FEB027',
      },
      package: 'mobile.butter.app',
      permissions: ['android.permission.USE_BIOMETRIC', 'android.permission.USE_FINGERPRINT'],
      googleServicesFile: './google-services.json',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'butter.social',
              pathPrefix: '/',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    scheme: ['butterweb3auth', 'butter'],
    plugins: [
      ['sentry-expo'],
      ['expo-localization'],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
          android: {
            enableProguardInReleaseBuilds: true,
            extraProguardRules: `
# expo-image proguard rules
-keep public class * extends com.bumptech.glide.module.LibraryGlideModule
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class * extends com.bumptech.glide.module.AppGlideModule {
 <init>(...);
}
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
-keep class com.bumptech.glide.load.data.ParcelFileDescriptorRewinder$InternalRewinder {
  *** rewind();
}
-keep public class com.bumptech.glide.request.ThumbnailRequestCoordinator {
  *;
}
-dontwarn com.bumptech.glide.load.resource.bitmap.VideoDecoder


-keep class com.bumptech.glide.GeneratedAppGlideModuleImpl
-keep public class com.bumptech.glide.integration.webp.WebpImage { *; }
-keep public class com.bumptech.glide.integration.webp.WebpFrame { *; }
-keep public class com.bumptech.glide.integration.webp.WebpBitmapFactory { *; }`,
            extraMavenRepos: [
              // Extra maven repo to compile @notifee/react-native
              // Ref: https://github.com/invertase/notifee/issues/911#issuecomment-1822234807
              '../../node_modules/@notifee/react-native/android/libs',
            ],
          },
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission:
            'By allowing the application to access Face ID, you enhance security. Your facial data is used exclusively for authentication, safeguarding your account and ensuring secure operations.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'By allowing the application to access your photos, you can set profile pictures and preserve event memories.',
        },
      ],
      [
        'expo-barcode-scanner',
        {
          cameraPermission:
            'By allowing the application to access the camera, you can set your profile picture and capture event memories',
        },
      ],
      [
        'expo-calendar',
        {
          calendarPermission:
            'By allowing the application to access your calendar, you streamline event management. Dates sync seamlessly, enhancing your scheduling convenience within the app while respecting your privacy.',
        },
      ],
      'react-native-compressor',
      '@react-native-firebase/app',
      './plugins/withBackgroundActions',
    ],
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'desmos-labs',
            project: 'butter',
          },
        },
      ],
    },
    extra: {
      eas: {
        projectId: 'a484cef2-20d2-4864-b940-f59bbc956049',
      },
    },
    updates: {
      enabled: false,
      fallbackToCacheTimeout: 0,
    },
  },
};
