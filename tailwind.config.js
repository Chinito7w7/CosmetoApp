/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['PlusJakartaSans_400Regular'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
      },
      fontSize: {
        'headline-xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.56px' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.36px' }],
        'headline-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.18px' }],
        'body-lg':     ['16px', { lineHeight: '24px' }],
        'body-md':     ['14px', { lineHeight: '22px' }],
        'body-sm':     ['12px', { lineHeight: '18px' }],
        'label-lg':    ['14px', { lineHeight: '20px', letterSpacing: '0.14px' }],
        'label-md':    ['12px', { lineHeight: '16px', letterSpacing: '0.24px' }],
        'label-sm':    ['11px', { lineHeight: '14px', letterSpacing: '0.44px' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      colors: {
        'on-primary': '#FFFFFF',
        background: '#FAF5F5',

        borderRadius: { sm: '4px', DEFAULT: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px' },
        background: '#FAF5F5',
        porcelain: '#FFFDFB',
        surface: '#FFFFFF',
        primary: { DEFAULT: '#E88D90', pressed: '#D9777A' },
        salmon: '#F4A896',
        peach: '#FBD6C6',
        ink: '#4A3E3D',
        taupe: '#7B6E6D',
        line: '#F0E4E4',
        divider: '#F6EAEA',
        success: { bg: '#E8F5EC', fg: '#2D6A4F' },
        warning: { bg: '#FEF3D6', fg: '#8F5D18' },
        danger:  { bg: '#FCEAEB', fg: '#A23E48' },
        
        // Áreas de servicio
        skincare: '#E88D90',
        makeup: '#F4A896',
        nails: '#FBD6C6',
      },
    },
  },
  plugins: [],
};
