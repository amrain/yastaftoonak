export const themeColors = {
  primary: 'bg-emerald-800 dark:bg-emerald-900',
  primaryText: 'text-emerald-800 dark:text-emerald-400',
  secondary: 'text-amber-500',
  secondaryBg: 'bg-amber-500',
  background: 'bg-slate-50 dark:bg-gray-900',
  card: 'bg-white dark:bg-gray-800',
  textMain: 'text-gray-800 dark:text-gray-100',
  textMuted: 'text-gray-500 dark:text-gray-400',
  border: 'border-gray-200 dark:border-gray-700',
};

export const globalStyles = `
  .font-reem { font-family: 'Reem Kufi', sans-serif; }
  .font-amiri { font-family: 'Amiri', serif; }
  .font-tajawal { font-family: 'Tajawal', sans-serif; }
  .bg-islamic {
    background-color: #064e3b;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;
