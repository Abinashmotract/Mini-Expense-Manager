// Month names array - can be easily modified or made locale-aware
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

// Alternative: Dynamic month names using Intl API (locale-aware)
export const getMonthNames = (locale: string = 'en-US'): string[] => {
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2000, i, 1);
    months.push(date.toLocaleString(locale, { month: 'long' }));
  }
  return months;
};

// Get current month name
export const getCurrentMonthName = (locale: string = 'en-US'): string => {
  const date = new Date();
  return date.toLocaleString(locale, { month: 'long' });
};

// Get month name by index (0-11)
export const getMonthNameByIndex = (index: number, locale: string = 'en-US'): string => {
  const date = new Date(2000, index, 1);
  return date.toLocaleString(locale, { month: 'long' });
};
