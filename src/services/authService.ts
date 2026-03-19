import api from "./api";

// 🔹 Mock for now
export const loginUser = async (username: string, password: string) => {
  if (username === "admin" && password === "password") {
    return {
      user: { id: 1, name: "Admin", role: "admin" },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

// 🔹 Later replace with:
// return api.post("/auth/login", { username, password });
