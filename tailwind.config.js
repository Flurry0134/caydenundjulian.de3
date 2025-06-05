/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#FFFFFF',
          text: '#1F2937',
          secondary: '#6B7280',
          accent: '#F3F4F6',
          border: '#E5E7EB',
        },
        dark: {
          bg: '#1F2937',
          text: '#F9FAFB',
          secondary: '#9CA3AF',
          accent: '#374151',
          border: '#4B5563',
        },
      },
    },
  },
  plugins: [],
};