import fs from "fs"
import {
  CfnManagedLoginBranding,
  CfnManagedLoginBrandingProps,
} from "aws-cdk-lib/aws-cognito"
import path from "path"

export const brandingTheme: CfnManagedLoginBrandingProps["settings"] = {
  categories: {
    global: {
      colorSchemeMode: "LIGHT",
      spacingDensity: "REGULAR",
      pageFooter: {
        enabled: false,
      },
      pageHeader: {
        enabled: false,
      },
    },

    form: {
      displayGraphics: false,
      location: {
        horizontal: "CENTER",
        vertical: "CENTER",
      },
      languageSelector: {
        enabled: false,
      },
    },
  },

  componentClasses: {
    buttons: {
      borderRadius: 8,
    },

    focusState: {
      lightMode: {
        borderColor: "027a54ff",
      },
    },

    link: {
      lightMode: {
        defaults: {
          textColor: "027a54ff",
        },
        hover: {
          textColor: "015c3fff",
        },
      },
    },

    input: {
      borderRadius: 8,

      lightMode: {
        defaults: {
          backgroundColor: "ffffffff",
          borderColor: "7d8998ff",
        },

        placeholderColor: "5f6b7aff",
      },
    },
  },

  components: {
    form: {
      borderRadius: 8,

      lightMode: {
        backgroundColor: "ffffffff",
        borderColor: "c6c6cdff",
      },

      logo: {
        enabled: true,
        formInclusion: "IN",
        location: "CENTER",
        position: "TOP",
      },
    },

    pageBackground: {
      lightMode: {
        color: "ffffffff",
      },

      image: {
        enabled: false,
      },
    },

    pageText: {
      lightMode: {
        bodyColor: "414d5cff",
        descriptionColor: "414d5cff",
        headingColor: "000716ff",
      },
    },

    primaryButton: {
      lightMode: {
        active: {
          backgroundColor: "015c3fff",
          textColor: "ffffffff",
        },

        defaults: {
          backgroundColor: "027a54ff",
          textColor: "ffffffff",
        },

        hover: {
          backgroundColor: "015c3fff",
          textColor: "ffffffff",
        },

        disabled: {
          backgroundColor: "ffffffff",
          borderColor: "ffffffff",
        },
      },

      darkMode: {
        active: {
          backgroundColor: "03b878ff",
          textColor: "000716ff",
        },

        defaults: {
          backgroundColor: "027a54ff",
          textColor: "ffffffff",
        },

        hover: {
          backgroundColor: "03d08fff",
          textColor: "000716ff",
        },

        disabled: {
          backgroundColor: "ffffffff",
          borderColor: "ffffffff",
        },
      },
    },

    secondaryButton: {
      lightMode: {
        defaults: {
          backgroundColor: "ffffffff",
          borderColor: "027a54ff",
          textColor: "027a54ff",
        },

        hover: {
          backgroundColor: "e8f5f0ff",
          borderColor: "015c3fff",
          textColor: "015c3fff",
        },
      },
    },
  },
}

const logoBase64 = fs
  .readFileSync(path.join(import.meta.dirname, "../../public/logo.svg"))
  .toString("base64")

export const brandingAssets: Array<CfnManagedLoginBranding.AssetTypeProperty> =
  [
    {
      bytes: logoBase64,
      category: "FORM_LOGO",
      colorMode: "LIGHT",
      extension: "SVG",
    },
  ]
