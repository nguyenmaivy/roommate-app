/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './pages/**/*.{js,jsx,ts,tsx}', // nếu có thư mục pages
        './src/**/*.{js,jsx,ts,tsx}',   // nếu có src
    ],
    theme: { extend: {} },
    plugins: [],
};