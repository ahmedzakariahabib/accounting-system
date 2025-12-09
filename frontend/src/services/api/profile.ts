import { api } from "../axios";

// Get My Profile
export const getMyProfile = async (id: string) => {
  const { data } = await api.get(`/api/v1/users/${id}`);
  return data.user;
};

// Update Profile (PATCH)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateMyProfile = async (id: string, body: any) => {
  const { data } = await api.patch(`/api/v1/profile/${id}`, body);
  return data;
};


// Change Password
export const changePassword = async (body: {
  password: string;
  newPassword: string;
}) => {
  const { data } = await api.post(`/api/v1/profile/change-password`, body);
  return data;
};
