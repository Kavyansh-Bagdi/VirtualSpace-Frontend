function getToken(): string | null {
  return localStorage.getItem("jwt");
}

function setToken(token: string) {
  localStorage.setItem("jwt", token.trim());
}

export { getToken, setToken };
