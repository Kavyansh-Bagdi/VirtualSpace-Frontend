function getToken(): string | null {
  return localStorage.getItem("jwt");
}

function setToken(token: string) {
  localStorage.setItem("jwt", token.trim());
}

function readToken(): { name?: string; email?: string } | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    const { name, email } = decoded;
    return { name, email };
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

function logout() {
  localStorage.removeItem("jwt");
}

export { getToken, setToken, readToken, logout };
