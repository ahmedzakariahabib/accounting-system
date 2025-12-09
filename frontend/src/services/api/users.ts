import { api } from "../axios";

export const getAllUsers = async () => {
  const res = await api.get("/api/v1/users");
  return res.data.data.users; // 🔥 صح من API تبعك
};

export const getSingleUser = async (id: string) => {
  const res = await api.get(`/api/v1/users/${id}`);
  return res.data.user;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUser = async (id: string, data: any) => {
  const res = await api.patch(`/api/v1/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/api/v1/users/${id}`);
  return res.data;
};
