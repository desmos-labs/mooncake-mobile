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
      desmosOrange01: string;
      desmosOrange02: string;
      desmosOrange03: string;
      desmosOrange04: string;
      desmosOrange05: string;

      desmosBlue01: string;
      desmosBlue02: string;
      desmosBlue03: string;
      desmosBlue04: string;
      desmosBlue05: string;
      desmosBlue06: string;
      desmosBlue07: string;

      pink01: string;
      pink02: string;
      pink03: string;
      purple01: string;
      purple02: string;
      purple03: string;

      yellow01: string;
      yellow02: string;
      yellow03: string;
      green01: string;
      green02: string;
      green03: string;

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

      // Desmos orange gradient 01
      dOrangeGradient01: string[];

      // Desmos orange gradient 02
      dOrangeGradient02: string[];

      // Desmos blue gradient 01
      dBlueGradient01: string[];

      // Desmos blue gradient 02
      dBlueGradient02: string[];

      // Desmos blue gradient 03
      dBlueGradient03: string[];

      pinkGradient: string[];

      whiteGradient01: string[];

      blackGradient01: string[];

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
