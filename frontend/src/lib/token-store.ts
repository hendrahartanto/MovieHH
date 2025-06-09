let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  console.log("new tokne" + accessToken);
};

export const getAccessToken = () => accessToken;
