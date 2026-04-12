/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        // 'salaf' هو الاسم اللي هتستخدمه في الكلاس (font-salaf)
        // 'AdwaAssalaf' هو الاسم اللي عرفناه في ملف الـ CSS
        salaf: ['AdwaAssalaf', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class', 
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }