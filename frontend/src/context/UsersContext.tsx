/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getAllUsers,
  getSingleUser,
  deleteUser as apiDeleteUser,
  updateUser as apiUpdateUser,
} from "../services/api/users";

import {
  getMyProfile,
  updateMyProfile,
  changePassword as apiChangePassword,
} from "../services/api/profile";
import { signupApi } from "../services/api/auth.api";

// =============================================
// Types
// =============================================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  verified?: boolean;
  status?: "active" | "inactive" | string;
  password?: string;        // ← ضفها هنا
  image?: string;
  location?: string;
  createdAt?: string;
}


interface UsersContextType {
  users: User[];
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (id: string, body: Partial<User>) => Promise<void>;
  addUser: ( body: Partial<User>) => Promise<void>;

  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;

  fetchProfile: (id: string) => Promise<void>;
  updateProfile: (id: string, body: Partial<User>) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<void>;

  loading: boolean;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

// =============================================
// Context
// =============================================

const UsersContext = createContext<UsersContextType | undefined>(undefined);

// =============================================
// Helpers — Mapping verified ↔ status
// =============================================

function mapServerToClient(user: any): User {
  return {
    ...user,
    status: user.verified ? "active" : "inactive",
  };
}

function mapClientToServer(user: Partial<User>) {
  const clone: any = { ...user };
  if ("status" in clone) clone.verified = clone.status === "active";
  delete clone.status;
  return clone;
}

// =============================================
// Provider
// =============================================

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
// ----------------------
// USERS LIST
// ----------------------

const fetchUsers = async () => {
  setLoading(true);
  try {
    const data = await getAllUsers();
    setUsers(data.map(mapServerToClient));
  } finally {
    setLoading(false);
  }
};

const addUser = async (body: Partial<User>) => {
  const payload = {
    name: body.name!,
    email: body.email!,
    password: body.password!,
    rePassword: body.password!,
    role: body.role!,
  };

  await signupApi(payload);
  await fetchUsers();
};

const deleteUser = async (id: string) => {
  await apiDeleteUser(id);
  setUsers((prev) => prev.filter((u) => u._id !== id));
};

const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await getSingleUser(id);
    return mapServerToClient(user);
  } catch {
    return null;
  }
};

const updateUser = async (id: string, body: Partial<User>) => {
  // لا تستخدم mapClientToServer
  const apiBody: any = {
    name: body.name,
    email: body.email,
    role: body.role,
  };

  await apiUpdateUser(id, apiBody);
  await fetchUsers();
};



  

  // ----------------------
  // PROFILE
  // ----------------------

  const fetchProfile = async (id: string) => {
    setLoading(true);
    try {
      const data = await getMyProfile(id);
      const mapped = mapServerToClient(data);
      setCurrentUser(mapped);
      localStorage.setItem("user", JSON.stringify(mapped));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id: string, body: Partial<User>) => {
    const apiBody = mapClientToServer(body);
    await updateMyProfile(id, apiBody);
    await fetchProfile(id);
  };

  

  const changePassword = async (oldPw: string, newPw: string) => {
    await apiChangePassword({ password: oldPw, newPassword: newPw });
  };

  // ----------------------
  // AUTO LOAD LOGGED USER
  // ----------------------

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const data = JSON.parse(stored) as User;
      setCurrentUser(data);
      setUserId(data._id);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchProfile(userId);
  }, [userId]);

  // ----------------------
  // PROVIDER VALUE
  // ----------------------

  return (
    <UsersContext.Provider
  value={{
    users,
    fetchUsers,
    deleteUser,
    getUserById,
    updateUser,
    addUser,          // ← هنا
    currentUser,
    setCurrentUser,
    fetchProfile,
    updateProfile,
    changePassword,
    loading,
    userId,
    setUserId,
  }}
>

      {children}
    </UsersContext.Provider>
  );
}

// =============================================
// Hook
// =============================================

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
};
