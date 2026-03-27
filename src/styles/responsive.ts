// Responsive Design System - Mobile-First Approach

export const breakpoints = {
  xs: '320px',    // Extra small screens
  sm: '640px',    // Small screens (tablets)
  md: '768px',    // Medium screens (small laptops)
  lg: '1024px',   // Large screens (desktops)
  xl: '1280px',   // Extra large screens
  '2xl': '1536px' // 2X large screens
};

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max-width queries
  xsMax: `@media (max-width: ${breakpoints.xs})`,
  smMax: `@media (max-width: ${breakpoints.sm})`,
  mdMax: `@media (max-width: ${breakpoints.md})`,
  lgMax: `@media (max-width: ${breakpoints.lg})`,
  xlMax: `@media (max-width: ${breakpoints.xl})`,
  
  // Range queries
  smOnly: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  mdOnly: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  lgOnly: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,
  
  // Orientation
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Dark mode
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)'
};

// Container sizes
export const containers = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  fluid: '100%'
};

// Spacing scale (mobile-first)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem'     // 256px
};

// Typography scale (responsive)
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
    mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],         // 72px
    '8xl': ['6rem', { lineHeight: '1' }],           // 96px
    '9xl': ['8rem', { lineHeight: '1' }]            // 128px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  }
};

// Responsive typography helpers
export const responsiveTypography = {
  heading: {
    fontSize: {
      xs: typography.fontSize['2xl'],
      sm: typography.fontSize['3xl'],
      md: typography.fontSize['4xl'],
      lg: typography.fontSize['5xl']
    }
  },
  subheading: {
    fontSize: {
      xs: typography.fontSize.xl,
      sm: typography.fontSize['2xl'],
      md: typography.fontSize['3xl'],
      lg: typography.fontSize['4xl']
    }
  },
  body: {
    fontSize: {
      xs: typography.fontSize.sm,
      sm: typography.fontSize.base,
      md: typography.fontSize.lg,
      lg: typography.fontSize.xl
    }
  },
  caption: {
    fontSize: {
      xs: typography.fontSize.xs,
      sm: typography.fontSize.sm,
      md: typography.fontSize.base,
      lg: typography.fontSize.lg
    }
  }
};

// Grid system
export const grid = {
  columns: {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    5: 'repeat(5, minmax(0, 1fr))',
    6: 'repeat(6, minmax(0, 1fr))',
    7: 'repeat(7, minmax(0, 1fr))',
    8: 'repeat(8, minmax(0, 1fr))',
    9: 'repeat(9, minmax(0, 1fr))',
    10: 'repeat(10, minmax(0, 1fr))',
    11: 'repeat(11, minmax(0, 1fr))',
    12: 'repeat(12, minmax(0, 1fr))',
    auto: 'repeat(auto-fit, minmax(250px, 1fr))',
    fill: 'repeat(auto-fill, minmax(250px, 1fr))',
    none: 'none'
  },
  gap: {
    0: '0',
    1: spacing[1],
    2: spacing[2],
    3: spacing[3],
    4: spacing[4],
    5: spacing[5],
    6: spacing[6],
    8: spacing[8],
    10: spacing[10],
    12: spacing[12],
    16: spacing[16],
    20: spacing[20],
    24: spacing[24]
  }
};

// Component-specific responsive utilities
export const responsiveComponents = {
  // Navigation
  navbar: {
    height: {
      mobile: '64px',
      desktop: '80px'
    },
    padding: {
      mobile: `${spacing[4]} ${spacing[6]}`,
      desktop: `${spacing[4]} ${spacing[8]}`
    }
  },
  
  // Cards
  card: {
    padding: {
      mobile: spacing[4],
      desktop: spacing[6]
    },
    borderRadius: {
      mobile: '8px',
      desktop: '12px'
    }
  },
  
  // Buttons
  button: {
    padding: {
      mobile: `${spacing[3]} ${spacing[6]}`,
      desktop: `${spacing[4]} ${spacing[8]}`
    },
    fontSize: {
      mobile: typography.fontSize.sm,
      desktop: typography.fontSize.base
    }
  },
  
  // Forms
  form: {
    input: {
      padding: {
        mobile: `${spacing[3]} ${spacing[4]}`,
        desktop: `${spacing[4]} ${spacing[6]}`
      },
      fontSize: {
        mobile: typography.fontSize.base,
        desktop: typography.fontSize.lg
      }
    }
  },
  
  // Tables
  table: {
    fontSize: {
      mobile: typography.fontSize.sm,
      desktop: typography.fontSize.base
    },
    padding: {
      mobile: spacing[2],
      desktop: spacing[3]
    }
  }
};

// Mobile-first responsive utilities
export const responsiveUtils = {
  // Show/hide utilities
  hidden: {
    xs: `${mediaQueries.xs} { display: none; }`,
    sm: `${mediaQueries.sm} { display: none; }`,
    md: `${mediaQueries.md} { display: none; }`,
    lg: `${mediaQueries.lg} { display: none; }`,
    xl: `${mediaQueries.xl} { display: none; }`
  },
  
  // Flexbox utilities
  flex: {
    direction: {
      column: {
        mobile: 'flex-direction: column;',
        desktop: `${mediaQueries.md} { flex-direction: row; }`
      }
    },
    wrap: {
      mobile: 'flex-wrap: wrap;',
      desktop: `${mediaQueries.lg} { flex-wrap: nowrap; }`
    }
  },
  
  // Grid utilities
  gridCols: {
    1: {
      mobile: 'grid-template-columns: repeat(1, 1fr);',
      tablet: `${mediaQueries.sm} { grid-template-columns: repeat(2, 1fr); }`,
      desktop: `${mediaQueries.lg} { grid-template-columns: repeat(3, 1fr); }`
    },
    2: {
      mobile: 'grid-template-columns: repeat(1, 1fr);',
      tablet: `${mediaQueries.sm} { grid-template-columns: repeat(2, 1fr); }`,
      desktop: `${mediaQueries.lg} { grid-template-columns: repeat(4, 1fr); }`
    }
  }
};

// Touch-friendly sizing
export const touchTargets = {
  minimum: '44px',  // iOS HIG minimum
  comfortable: '48px',
  large: '56px'
};

// Safe area insets (for notched devices)
export const safeArea = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
  all: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
};


