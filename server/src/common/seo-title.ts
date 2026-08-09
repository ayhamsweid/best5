export const formatSeoTitle = (value: string) => {
  const title = value.trim();
  if (!title) return 'Best5';
  return /best5/i.test(title) ? title : `${title} | Best5`;
};
