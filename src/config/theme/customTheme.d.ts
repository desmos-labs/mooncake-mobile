// treat this file as a module.
export {};

declare global {
  namespace ReactNativePaper {
    /**
     * Interface that represents the color used to
     * provide to the user a feedback about the complexity
     * of a secret.
     */
    interface ComplexityHintColors {
      weak: string;
      normal: string;
      strong: string;
      veryStrong: string;
    }

    interface IconColors {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    }

    interface FontColors {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      red: string;
    }

    interface ToggleColors {
      active: string;
      inactive: string;
    }

    interface ThemeColors {
      /**
       * V2
       */
      butterOrange01: string;
      butterOrange02: string;
      butterOrange03: string;
      butterOrange04: string;
      butterOrange05: string;

      butterYellow01: string;
      butterYellow02: string;
      butterYellow03: string;
      butterYellow04: string;
      butterYellow05: string;

      pink01: string;
      pink02: string;
      pink03: string;
      purple01: string;
      purple02: string;
      purple03: string;

      red01: string;
      red02: string;
      red03: string;
      orange01: string;
      orange02: string;
      orange03: string;

      white: string;
      backgroundGrey: string;
      surfaceGrey: string;
      lightGrey01: string;
      lightGrey02: string;
      iconGrey: string;

      grey01: string;
      grey02: string;
      midGrey: string;
      darkGrey: string;
      surfaceBlack: string;
      black: string;
      backgroundBlue: string;
      dividerGrey: string;
      tabIconGrey: string;

      accentRed01: string;
      accentRed02: string;
      accentOrange01: string;
      accentOrange02: string;
      accentYellow01: string;
      accentYellow02: string;
      accentGreen01: string;
      accentGreen02: string;
      accentLightBlue01: string;
      accentLightBlue02: string;
      accentBlue01: string;
      accentBlue02: string;

      butterOrangeGradient01: string[];

      butterOrangeGradient02: string[];

      butterYellowGradient: string[];

      pinkGradient: string[];

      whiteGradient01: string[];

      blackGradient01: string[];

      // MORE GRADIENTS TO BE ADDED

      /**
       * V2 end
       */
    }

    interface Spacing {
      xs: number | string;
      s: number | string;
      m: number | string;
      l: number | string;
      xl: number | string;
    }

    interface Theme {
      spacing: ReactNativePaper.Spacing;
    }
  }
}
