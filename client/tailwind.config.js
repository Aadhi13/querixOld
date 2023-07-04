/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebook: "#1877f2",
        twitter: "#1da1f2",
        linkedin: "#0A66C2",
        linkedin2: "#004182",
        linkedin3: "#0073b1",
        primary: "#0088cc", //telgram official color
        primary2: "#4da6ff",
        breed: "#1458a7",
        buttonHover: "#F7F7F7", //airbnb button hover color
        profileBtBg: "#ccd6dd",
        profileBt: "#657786",
      },
      fontFamily: {
        'apple-system': ['-apple-system', '-apple-system', 'BlinkMacSystemFont',
          '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
          '"Open Sans"', '"Helvetica Neue"', 'sans-serif']
      }
    },
  },
  plugins: [],
}

