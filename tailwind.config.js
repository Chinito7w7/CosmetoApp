/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
