import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

/**
 * Authentication state interface for the Zustand store
 */
type AuthState = {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Current user data or null if not authenticated */
  user: User | null;
  /** Loading state during authentication operations */
  isLoading: boolean;

  /** Updates the authentication status */
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  /** Updates the current user data */
  setUser: (user: User | null) => void;
  /** Updates the loading state */
  setIsLoading: (isLoading: boolean) => void;

  /** Fetches and validates the currently authenticated user */
  fetchAuthenticatedUser: () => Promise<void>;
};

/**
 * Zustand store for managing authentication state
 *
 * This store handles user authentication, user data management, and loading states
 * throughout the application. It provides centralized state management for auth-related
 * operations and automatic user session validation.
 *
 * @returns Object containing authentication state and actions
 *
 * @example
 * ```tsx
 * // Basic usage in a component
 * const { isAuthenticated, user, isLoading } = useAuthStore();
 *
 * // Check if user is logged in
 * if (isAuthenticated && user) {
 *   console.log(`Welcome ${user.name}!`);
 * }
 *
 * // Manually fetch user data
 * const { fetchAuthenticatedUser } = useAuthStore();
 * await fetchAuthenticatedUser();
 *
 * // Update user data
 * const { setUser, setIsAuthenticated } = useAuthStore();
 * setUser(newUserData);
 * setIsAuthenticated(true);
 *
 * // Handle logout
 * const { setUser, setIsAuthenticated } = useAuthStore();
 * setUser(null);
 * setIsAuthenticated(false);
 * ```
 *
 * @example
 * ```tsx
 * // Usage with loading state
 * const { isLoading, fetchAuthenticatedUser } = useAuthStore();
 *
 * useEffect(() => {
 *   fetchAuthenticatedUser();
 * }, []);
 *
 * if (isLoading) return <LoadingSpinner />;
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering based on auth state
 * const { isAuthenticated, user } = useAuthStore();
 *
 * return (
 *   <>
 *     {isAuthenticated ? (
 *       <Dashboard user={user} />
 *     ) : (
 *       <LoginScreen />
 *     )}
 *   </>
 * );
 * ```
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  /**
   * Updates the authentication status
   * @param isAuthenticated - New authentication state
   */
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  /**
   * Updates the current user data
   * @param user - User object or null to clear user data
   */
  setUser: (user) => set({ user }),

  /**
   * Updates the loading state
   * @param isLoading - New loading state
   */
  setIsLoading: (isLoading) => set({ isLoading }),

  /**
   * Fetches and validates the currently authenticated user from Appwrite
   *
   * This function retrieves the current user session and updates the store state
   * accordingly. It handles authentication validation and error cases gracefully.
   *
   * @async
   * @returns Promise that resolves when the operation is complete
   *
   * @throws Will log errors to console if user retrieval fails
   *
   * @example
   * ```tsx
   * // Call on app initialization
   * useEffect(() => {
   *   fetchAuthenticatedUser();
   * }, []);
   *
   * // Call after login/logout operations
   * await fetchAuthenticatedUser();
   * ```
   */
  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      if (user) set({ isAuthenticated: true, user: user as unknown as User });
      else set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.log(error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
