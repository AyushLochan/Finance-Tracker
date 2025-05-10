export const categoryColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * categoryColors.length);
  return categoryColors[randomIndex];
};