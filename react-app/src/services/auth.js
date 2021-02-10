export const authenticate = async () => {
  const response = await fetch("/api/auth/", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const login = async (credential, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  return await response.json();
};

export const changePassword = async (credential, currentPassword, newPassword) => {
  const response = await fetch("/api/auth/changepsw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      credential,
      password: currentPassword,
      newPassword,
    }),
  });
  return await response.json();
};

export const logout = async () => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

export const signup = async (username, name, email, password, bio, websiteUrl, profilePicUrl) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      name,
      email,
      password,
      bio,
      websiteUrl,
      profilePicUrl
    }),
  });
  return await response.json();
};

export const updatProfile = async (username, name, email, bio, websiteUrl, profilePicUrl) => {
  const response = await fetch("/api/auth/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      name,
      email,
      bio,
      websiteUrl,
      profilePicUrl
    }),
  });
  return await response.json();
};
