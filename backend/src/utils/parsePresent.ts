export const parsePrecent = (value?: string): number => {
  if (!value || value.trim() === '' || value === '-') return 0;
  const cleaned = value
    .replace(/%/g, '')
    .replace(',', '.')
    .trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};