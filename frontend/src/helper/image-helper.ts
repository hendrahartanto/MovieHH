export const formatImageUrl = (imageUrl: string) => {
  return `${import.meta.env.VITE_APP_API_URL}${imageUrl}`;
};
