import { createContext, ReactNode, useState } from "react";

export interface User {
  id: string | number;
  email: string;
  name: string;
  picture?: string;
  credits: number;
  pref?: any;
  created_at: string;
  updated_at: string;
}

export interface UserContextType {
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

type UserProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isVegMode, setIsVegMode] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isVegMode, setIsVegMode }}>
      {children}
    </UserContext.Provider>
  );
}
