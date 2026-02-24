/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'uagrm-red': '#8B0000',
                'uagrm-blue': '#1A237E',
                'uagrm-bg': '#F8FAFC',
            },
        },
    },
    plugins: [],
}
