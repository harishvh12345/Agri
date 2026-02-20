/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdfce9',
                    100: '#fbf9c4',
                    200: '#f7f18b',
                    300: '#f1e247',
                    400: '#ebcf13',
                    500: '#d9b30b',
                    600: '#be8d07',
                    700: '#986509',
                    800: '#7d500f',
                    900: '#6a4212',
                    950: '#3e2206',
                },
            },
        },
    },
    plugins: [],
}
