import api from "./api";

export const authService = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  signup: (payload) => api.post("/auth/signup", payload).then((res) => res.data),
  dashboard: () => api.get("/user/dashboard").then((res) => res.data),
  favorite: (destination) => api.post("/user/favorite", { destination }).then((res) => res.data)
};
