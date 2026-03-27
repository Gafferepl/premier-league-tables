// Responsive Design System 2026 - Latest Mobile-First Standards
export const breakpoints2026 = {
  // 2026 updated breakpoints for modern devices
  xs: '375px',    // iPhone SE, small phones
  sm: '414px',    // iPhone 15 Pro, standard phones
  md: '768px',    // iPad mini, large tablets
  lg: '1024px',   // iPad Pro, small laptops
  xl: '1280px',   // Desktop, laptops
  '2xl': '1440px', // Large desktop
  '3xl': '1920px', // Extra large desktop
  '4xl': '2560px'  // 4K displays
};

export const mediaQueries2026 = {
  xs: `@media (min-width: ${breakpoints2026.xs})`,
  sm: `@media (min-width: ${breakpoints2026.sm})`,
  md: `@media (min-width: ${breakpoints2026.md})`,
  lg: `@media (min-width: ${breakpoints2026.lg})`,
  xl: `@media (min-width: ${breakpoints2026.xl})`,
  '2xl': `@media (min-width: ${breakpoints2026['2xl']})`,
  '3xl': `@media (min-width: ${breakpoints2026['3xl']})`,
  '4xl': `@media (min-width: ${breakpoints2026['4xl']})`,
  
  // Max-width queries
  xsMax: `@media (max-width: ${breakpoints2026.xs})`,
  smMax: `@media (max-width: ${breakpoints2026.sm})`,
  mdMax: `@media (max-width: ${breakpoints2026.md})`,
  lgMax: `@media (max-width: ${breakpoints2026.lg})`,
  xlMax: `@media (max-width: ${breakpoints2026.xl})`,
  '2xlMax': `@media (max-width: ${breakpoints2026['2xl']})`,
  
  // Range queries for 2026 devices
  mobile: `@media (max-width: ${breakpoints2026.md})`,
  tablet: `@media (min-width: ${breakpoints2026.md}) and (max-width: ${breakpoints2026.lg})`,
  desktop: `@media (min-width: ${breakpoints2026.lg})`,
  
  // 2026 device-specific queries
  iPhone: '@media (max-width: 430px)',
  iPad: '@media (min-width: 768px) and (max-width: 1024px)',
  foldable: '@media (min-width: 280px) and (max-width: 400px)',
  
  // Orientation and aspect ratio
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  square: '@media (min-aspect-ratio: 1/1) and (max-aspect-ratio: 1/1)',
  wide: '@media (min-aspect-ratio: 16/9)',
  ultrawide: '@media (min-aspect-ratio: 21/9)',
  
  // Display density
  highDPI: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  ultraHD: '@media (min-width: 3840px)',
  
  // 2026 color scheme and preferences
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  reducedData: '@media (prefers-reduced-data: reduce)',
  
  // 2026 device capabilities
  hover: '@media (hover: hover)',
  noHover: '@media (hover: none)',
  touch: '@media (pointer: coarse)',
  mouse: '@media (pointer: fine)',
  
  // 2026 environment
  standalone: '@media (display-mode: standalone)',
  fullscreen: '@media (display-mode: fullscreen)',
  minimalUI: '@media (display-mode: minimal-ui)',
  browser: '@media (display-mode: browser)'
};

// 2026 Container sizes for modern layouts
export const containers2026 = {
  xs: '100%',
  sm: '414px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1920px',
  '4xl': '2560px',
  fluid: '100%',
  readable: '65ch',  // Optimal reading width
  narrow: '45ch',   // Compact reading
  wide: '90ch'      // Wide content
};

// 2026 Spacing scale (mobile-first with larger steps)
export const spacing2026 = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem'       // 384px
};

// 2026 Typography scale with variable fonts
export const typography2026 = {
  fontFamily: {
    sans: [
      'Inter Variable',
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ],
    serif: [
      'Georgia Variable',
      'Georgia',
      'Cambria',
      'Times New Roman',
      'Times',
      'serif'
    ],
    mono: [
      'JetBrains Mono Variable',
      'JetBrains Mono',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace'
    ],
    display: [
      'Inter Display Variable',
      'Inter Display',
      'Inter',
      'system-ui',
      'sans-serif'
    ]
  },
  
  // 2026 Variable font axes
  fontVariationSettings: {
    weight: 'wght',
    slant: 'slnt',
    opticalSize: 'opsz',
    grade: 'GRAD',
    xHeight: 'XTRA',
    width: 'wdth'
  },
  
  // 2026 Responsive typography with fluid scaling
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.005em' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.035em' }],        // 60px
    '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],         // 72px
    '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.045em' }],           // 96px
    '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em' }]             // 128px
  },
  
  // 2026 Font weights using variable fonts
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
    
    // Variable font specific weights
    variable: '100 900',
    display: '200 800',
    text: '300 700',
    heading: '400 900'
  },
  
  // 2026 Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  // 2026 Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
};

// 2026 Responsive typography with fluid scaling
export const fluidTypography2026 = {
  // Clamp function for fluid typography
  clamp: (minSize: string, maxSize: string, minViewport: string, maxViewport: string) => 
    `clamp(${minSize}, calc(${minSize} + (${maxSize} - ${minSize}) * ((100vw - ${minViewport}) / (${maxViewport} - ${minViewport}))), ${maxSize})`,
  
  // Fluid heading sizes
  heading: {
    h1: 'clamp(2rem, 5vw, 4rem)',      // 32px to 64px
    h2: 'clamp(1.5rem, 4vw, 3rem)',     // 24px to 48px
    h3: 'clamp(1.25rem, 3vw, 2rem)',    // 20px to 32px
    h4: 'clamp(1.125rem, 2.5vw, 1.5rem)', // 18px to 24px
    h5: 'clamp(1rem, 2vw, 1.25rem)',    // 16px to 20px
    h6: 'clamp(0.875rem, 1.5vw, 1rem)'  // 14px to 16px
  },
  
  // Fluid body text
  body: {
    small: 'clamp(0.75rem, 1.5vw, 0.875rem)',  // 12px to 14px
    base: 'clamp(0.875rem, 1.5vw, 1rem)',      // 14px to 16px
    large: 'clamp(1rem, 1.5vw, 1.125rem)',     // 16px to 18px
    xl: 'clamp(1.125rem, 1.5vw, 1.25rem)'      // 18px to 20px
  }
};

// 2026 Grid system with CSS Grid and Flexbox
export const grid2026 = {
  // CSS Grid templates
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
    
    // 2026 Responsive grid
    auto: 'repeat(auto-fit, minmax(280px, 1fr))',
    fill: 'repeat(auto-fill, minmax(280px, 1fr))',
    compact: 'repeat(auto-fill, minmax(200px, 1fr))',
    spacious: 'repeat(auto-fill, minmax(350px, 1fr))',
    none: 'none'
  },
  
  // 2026 Gap sizes
  gap: {
    0: '0',
    1: spacing2026[1],
    2: spacing2026[2],
    3: spacing2026[3],
    4: spacing2026[4],
    5: spacing2026[5],
    6: spacing2026[6],
    8: spacing2026[8],
    10: spacing2026[10],
    12: spacing2026[12],
    16: spacing2026[16],
    20: spacing2026[20],
    24: spacing2026[24],
    32: spacing2026[32]
  },
  
  // 2026 Container queries emulation
  container: {
    sm: '@container (min-width: 414px)',
    md: '@container (min-width: 768px)',
    lg: '@container (min-width: 1024px)',
    xl: '@container (min-width: 1280px)',
    '2xl': '@container (min-width: 1440px)'
  }
};

// 2026 Component-specific responsive utilities
export const responsiveComponents2026 = {
  // Navigation with modern patterns
  navbar: {
    height: {
      mobile: '64px',
      desktop: '80px',
      large: '96px'
    },
    padding: {
      mobile: `${spacing2026[4]} ${spacing2026[6]}`,
      desktop: `${spacing2026[4]} ${spacing2026[8]}`,
      large: `${spacing2026[4]} ${spacing2026[12]}`
    }
  },
  
  // Cards with modern shadows and borders
  card: {
    padding: {
      mobile: spacing2026[4],
      desktop: spacing2026[6],
      large: spacing2026[8]
    },
    borderRadius: {
      mobile: '12px',
      desktop: '16px',
      large: '20px'
    },
    boxShadow: {
      mobile: '0 1px 3px rgba(0, 0, 0, 0.12)',
      desktop: '0 4px 6px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px rgba(0, 0, 0, 0.1)'
    }
  },
  
  // Buttons with modern touch targets
  button: {
    padding: {
      mobile: `${spacing2026[3]} ${spacing2026[6]}`,
      desktop: `${spacing2026[4]} ${spacing2026[8]}`,
      large: `${spacing2026[5]} ${spacing2026[10]}`
    },
    fontSize: {
      mobile: typography2026.fontSize.sm,
      desktop: typography2026.fontSize.base,
      large: typography2026.fontSize.lg
    },
    minHeight: {
      mobile: '44px',  // iOS HIG minimum
      desktop: '48px',
      large: '56px'
    }
  },
  
  // Forms with modern inputs
  form: {
    input: {
      padding: {
        mobile: `${spacing2026[3]} ${spacing2026[4]}`,
        desktop: `${spacing2026[4]} ${spacing2026[6]}`,
        large: `${spacing2026[5]} ${spacing2026[8]}`
      },
      fontSize: {
        mobile: typography2026.fontSize.base,
        desktop: typography2026.fontSize.lg,
        large: typography2026.fontSize.xl
      },
      minHeight: {
        mobile: '44px',
        desktop: '48px',
        large: '56px'
      }
    }
  },
  
  // Tables with responsive patterns
  table: {
    fontSize: {
      mobile: typography2026.fontSize.sm,
      desktop: typography2026.fontSize.base,
      large: typography2026.fontSize.lg
    },
    padding: {
      mobile: spacing2026[2],
      desktop: spacing2026[3],
      large: spacing2026[4]
    }
  }
};

// 2026 Touch-friendly sizing following latest guidelines
export const touchTargets2026 = {
  minimum: '44px',     // iOS HIG minimum (unchanged)
  comfortable: '48px', // Android Material Design
  large: '56px',      // Enhanced accessibility
  extraLarge: '64px'  // High accessibility
};

// 2026 Safe area insets for modern devices
export const safeArea2026 = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
  
  // Combined safe areas
  all: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
  horizontal: 'env(safe-area-inset-right) env(safe-area-inset-left)',
  vertical: 'env(safe-area-inset-top) env(safe-area-inset-bottom)',
  
  // 2026 Device-specific safe areas
  notch: 'env(safe-area-inset-top)',
  homeIndicator: 'env(safe-area-inset-bottom)',
  
  // Fallbacks for older devices
  fallback: {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  }
};

// 2026 Responsive utilities with modern CSS
export const responsiveUtils2026 = {
  // Show/hide utilities with modern CSS
  hidden: {
    xs: `${mediaQueries2026.xs} { display: none; }`,
    sm: `${mediaQueries2026.sm} { display: none; }`,
    md: `${mediaQueries2026.md} { display: none; }`,
    lg: `${mediaQueries2026.lg} { display: none; }`,
    xl: `${mediaQueries2026.xl} { display: none; }`,
    '2xl': `${mediaQueries2026['2xl']} { display: none; }`,
    '3xl': `${mediaQueries2026['3xl']} { display: none; }`,
    '4xl': `${mediaQueries2026['4xl']} { display: none; }`
  },
  
  // Modern flexbox utilities
  flex: {
    direction: {
      column: {
        mobile: 'flex-direction: column;',
        tablet: `${mediaQueries2026.md} { flex-direction: row; }`,
        desktop: `${mediaQueries2026.lg} { flex-direction: row; }`
      }
    },
    wrap: {
      mobile: 'flex-wrap: wrap;',
      desktop: `${mediaQueries2026.lg} { flex-wrap: nowrap; }`
    },
    gap: {
      responsive: {
        mobile: `gap: ${spacing2026[4]};`,
        tablet: `${mediaQueries2026.md} { gap: ${spacing2026[6]}; }`,
        desktop: `${mediaQueries2026.lg} { gap: ${spacing2026[8]}; }`
      }
    }
  },
  
  // Modern grid utilities
  gridCols: {
    responsive: {
      mobile: 'grid-template-columns: 1fr;',
      tablet: `${mediaQueries2026.md} { grid-template-columns: repeat(2, 1fr); }`,
      desktop: `${mediaQueries2026.lg} { grid-template-columns: repeat(3, 1fr); }`,
      large: `${mediaQueries2026['2xl']} { grid-template-columns: repeat(4, 1fr); }`
    }
  },
  
  // 2026 Container queries utilities
  container: {
    xs: '@container (min-width: 375px)',
    sm: '@container (min-width: 414px)',
    md: '@container (min-width: 768px)',
    lg: '@container (min-width: 1024px)',
    xl: '@container (min-width: 1280px)',
    '2xl': '@container (min-width: 1440px)',
    '3xl': '@container (min-width: 1920px)',
    '4xl': '@container (min-width: 2560px)'
  }
};


