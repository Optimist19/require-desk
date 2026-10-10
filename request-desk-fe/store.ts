import { create } from "zustand";
import { apiInstance, authInstance } from "./utils/axios";
import { UserDataType } from "./types";

type RequestDataType = {
  title: string;
  category: string;
  priority: string;
};

export interface PaginationType {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProfileType {
  message: string;
  idExist: {
    _id: string;
    role: "admin" | "user";
    name: string;
    email: string;
    createdAt: string;
    __v: number;
  };
}

interface RegisterReturnType {
  message: string;
  user: {
    user_id: string;
    role: string;
    email: string;
    name: string;
  };
}

export interface RequestList {
  category: string;
  createdAt: string;
  priority: string;
  submittedBy: string;
  name: string;
  status: "Open" | "In progress" | "Resolved";
  title: string;
  _v: number;
  _id: string;
  userId: string;
}

export interface getUsersReturnType {
  _id: string;
  role: string;
  email: string;
  name: string;
  createdAt: string;
  __v: number;
}

interface LoginReturnType {
  accessToken: string;
  // user: {
  //   user_id: string;
  //   role: string;
  //   email: string;
  //   name: string;
  // };
}

type StateType = {
  accessToken: string;
  // errMessage: string;
  // role: string;
  mobileNav: boolean;
  requestFormModal: boolean;
  email: string;
  isLoggedIn: boolean;
  users: getUsersReturnType[];
  user: ProfileType | null;
  listOfRequest: RequestList[];
  paginationMetaData: PaginationType | null;
};

interface StateActionType {
  submitRequest: (userData: RequestDataType) => Promise<RequestList>;
  authFtn: (
    data: UserDataType
  ) => Promise<LoginReturnType | RegisterReturnType>;
  requestFormModalFtn: (a: boolean) => void;
  setMobileNav: () => void;
  getUsers: (page?: number) => Promise<getUsersReturnType>;
  getUser: () => Promise<ProfileType>;
  logOut: () => void;
  setAccessToken: (accessToken: string) => void;
  getRequests: () => Promise<RequestList>;
  deleteUser: (id: string) => void;
  refreshAccessToken: () => Promise<string>;
  updateRequest: (id: string, status: RequestList["status"]) => Promise<void>;
}

export const useRequestDesk = create<StateType & StateActionType>(
  (set, get) => ({
    // Data
    accessToken: "",
    // errMessage: "",
    // role: "",
    mobileNav: false,
    requestFormModal: false,
    email: "",
    isLoggedIn: false,
    users: [],
    user: null,
    listOfRequest: [],
    paginationMetaData: null,

    //  Actions
    submitRequest: async (userData) => {
      const { title, category, priority } = userData;
      try {
        const role = get().user?.idExist?.role;
        const name = get().user?.idExist?.name;
        const userId = get().user?.idExist?._id;

        const response = await apiInstance.post("/api/request/add", {
          title,
          category,
          priority,
          status: "Open",
          submittedBy: role,
          name,
          userId
        });
        return response.data.message;
      } catch (err) {
        throw err;
      }
    },
    deleteUser: async (id: string) => {
      try {
        await apiInstance.delete(`/api/users/${id}`);
      } catch (error) {
        throw error;
      }
    },
    updateRequest: async (id, status) => {
      try {
        const response = await apiInstance.patch(`/api/request/${id}`, {
          status
        });
        const updatedRequest: RequestList = response.data.updatedData;
        set((state) => ({
          listOfRequest: state.listOfRequest.map((request) =>
            request._id === id ? updatedRequest : request
          )
        }));
      } catch (error) {
        throw error;
      }
    },
    getRequests: async () => {
      try {
        const response = await apiInstance.get("/api/request/getRequests");
        set({ listOfRequest: response?.data?.data });
        return response?.data?.data;
      } catch (error) {
        throw error;
      }
    },
    requestFormModalFtn: (data) => set({ requestFormModal: data }),
    setMobileNav: () => set((state) => ({ mobileNav: !state.mobileNav })),
    authFtn: async (data: UserDataType) => {
      const { role } = data;
      try {
        if (role !== "user" && role !== "admin") {
          const response = await authInstance.post("/api/auth/login", data);

          set({
            email: response?.data?.user?.email,
            accessToken: response?.data?.accessToken,
            isLoggedIn: true
          });
          return response.data.accessToken;
        }

        const response = await authInstance.post("/api/auth/register", data);
        set({
          email: response?.data?.user?.email
        });
        return response.data;
      } catch (err) {
        throw err;
      }
    },

    getUsers: async (page?: number) => {
      try {
        const response = await apiInstance.get(
          `/api/users/get-users?p=${page}&limit=5`
        );
        set({
          users: response?.data?.users,
          paginationMetaData: response?.data?.paginate
        });

        return response?.data;
      } catch (err) {
        throw err;
      }
    },
    getUser: async () => {
      try {
        const response = await apiInstance.get("/api/users/get-user");

        set({ user: response?.data });
        return response?.data;
      } catch (err) {
        throw err;
      }
    },
    logOut: async () => {
      try {
        await authInstance.post("/api/auth/logout");
      } catch (error) {
        throw error;
      }
    },
    setAccessToken: (accessToken) => set({ accessToken: accessToken }),
    refreshAccessToken: async () => {
      try {
        const response = await authInstance.get("/api/auth/refreshToken", {
          withCredentials: true
        });

        const token = response.data.accessToken;
        set({
          accessToken: token,
          isLoggedIn: true
        });

        return token;
      } catch (error) {
        set({
          accessToken: "",
          isLoggedIn: false
        });

        return null;
      }
    }
  })
);
