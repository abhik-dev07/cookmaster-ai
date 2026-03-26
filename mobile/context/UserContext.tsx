import { createContext } from "react";

export interface User {
  id: number;
  email: string;
  name: string; // This will store the username from signup
  picture?: string;
  credits: number;
  pref?: any;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isVegMode: boolean;
  setIsVegMode: (isVeg: boolean) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isVegMode: false,
  setIsVegMode: () => {},
});
