export const setToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000);
};

export const getToken = () => {
  const expiry = localStorage.getItem("tokenExpiry");

  if (!expiry || Date.now() > expiry) {
    logout();
    return null;
  }

  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};
