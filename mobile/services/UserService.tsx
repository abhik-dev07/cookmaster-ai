import GlobalApi from "@/services/GlobalApi";

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  credits: number;
  pref?: any;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  data?: User;
  error?: string;
}

export interface UsersResponse {
  data: User[];
  error?: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  picture?: string;
}

export interface UpdateUserData {
  name?: string;
  picture?: string;
  credits?: number;
  pref?: any;
}

class UserService {
  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const result = await GlobalApi.GetUserByEmail(email);
      console.log("User fetched by email:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error fetching user by email:", error);
      return {
        error: error.response?.data?.error?.message || "Failed to fetch user",
      };
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }

      const result = await GlobalApi.CreateNewUser(userData);
      console.log("User created:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error creating user:", error);
      return {
        error: error.response?.data?.error?.message || "Failed to create user",
      };
    }
  }

  /**
   * Update user
   */
  async updateUser(
    userId: string | number,
    userData: UpdateUserData
  ): Promise<UserResponse> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const result = await GlobalApi.UpdateUser(userId, userData);
      console.log("User updated:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error updating user:", error);
      return {
        error: error.response?.data?.error?.message || "Failed to update user",
      };
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UsersResponse> {
    try {
      const result = await GlobalApi.GetAllUsers();
      console.log("All users fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching all users:", error);
      return {
        data: [],
        error: error.response?.data?.error?.message || "Failed to fetch users",
      };
    }
  }

  /**
   * Get or create user (useful for first-time login)
   */
  async getOrCreateUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }

      // First try to get existing user
      const existingUser = await this.getUserByEmail(userData.email);

      if (existingUser.data) {
        return existingUser; // User exists, return it
      }

      // If there's an error and it's not a "not found" error, return it
      if (existingUser.error) {
        // Check if it's a 404 or "not found" type error
        const isNotFoundError =
          existingUser.error.toLowerCase().includes("not found") ||
          existingUser.error.toLowerCase().includes("404") ||
          existingUser.error.toLowerCase().includes("doesn't exist");

        if (!isNotFoundError) {
          return existingUser; // Return other types of errors
        }
      }

      // User doesn't exist, create new user
      return await this.createUser(userData);
    } catch (error: any) {
      console.error("Error in getOrCreateUser:", error);
      return {
        error: "Failed to get or create user",
      };
    }
  }

  /**
   * Handle user verification - get existing user or create new one
   * This method is specifically for handling user verification flow
   */
  async handleUserVerification(
    email: string,
    name: string,
    picture?: string
  ): Promise<User | null> {
    try {
      if (!email || !name) {
        throw new Error("Email and name are required");
      }

      const userData: CreateUserData = {
        email,
        name,
        picture,
      };

      const result = await this.getOrCreateUser(userData);

      if (result.error) {
        console.error("Error in handleUserVerification:", result.error);
        return null;
      }

      return result.data || null;
    } catch (error: any) {
      console.error("Error in handleUserVerification:", error);
      return null;
    }
  }

  /**
   * Update user credits
   */
  async updateUserCredits(
    userId: string | number,
    credits: number
  ): Promise<UserResponse> {
    return this.updateUser(userId, { credits });
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string | number,
    preferences: any
  ): Promise<UserResponse> {
    return this.updateUser(userId, { pref: preferences });
  }

  /**
   * Update user profile picture
   */
  async updateUserPicture(
    userId: string | number,
    pictureUrl: string
  ): Promise<UserResponse> {
    return this.updateUser(userId, { picture: pictureUrl });
  }

  /**
   * Check if user exists
   */
  async checkUserExists(email: string): Promise<boolean> {
    try {
      const result = await this.getUserByEmail(email);
      return !!result.data;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string | number): Promise<UserResponse> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Since there's no direct get user by ID endpoint, we'll need to get all users and filter
      // This is not ideal for performance, but it's a workaround
      const allUsers = await this.getAllUsers();

      if (allUsers.error) {
        return { error: allUsers.error };
      }

      const user = allUsers.data.find(
        (u) => u.id.toString() === userId.toString()
      );

      if (!user) {
        return { error: "User not found" };
      }

      return { data: user };
    } catch (error: any) {
      console.error("Error fetching user by ID:", error);
      return {
        error: "Failed to fetch user by ID",
      };
    }
  }
}

export default new UserService();
