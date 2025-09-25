import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Configuration options for the useAppwrite hook
 * @template T - Type of data returned by the function
 * @template P - Type of parameters passed to the function
 */
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  /** Asynchronous function to execute for data retrieval */
  fn: (params: P) => Promise<T>;
  /** Parameters to pass to the function (optional) */
  params?: P;
  /** If true, prevents automatic execution on component mount */
  skip?: boolean;
}

/**
 * Return value of the useAppwrite hook
 * @template T - Type of returned data
 * @template P - Type of parameters
 */
interface UseAppwriteReturn<T, P> {
  /** Retrieved data or null if not yet loaded */
  data: T | null;
  /** Indicates if a request is in progress */
  loading: boolean;
  /** Error message or null if no error */
  error: string | null;
  /** Function to relaunch the request with new parameters */
  refetch: (newParams?: P) => Promise<void>;
}

/**
 * Custom hook for managing asynchronous calls with Appwrite
 *
 * @template T - Type of data returned by the function
 * @template P - Type of parameters passed to the function
 *
 * @param {UseAppwriteOptions<T, P>} options - Configuration options
 * @param {Function} options.fn - Asynchronous function to execute for data retrieval
 * @param {P} [options.params={}] - Parameters to pass to the function (optional)
 * @param {boolean} [options.skip=false] - If true, prevents automatic execution on component mount
 *
 * @returns {UseAppwriteReturn<T, P>} Object containing data, loading, error and refetch
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, loading, error, refetch } = useAppwrite({
 *   fn: getUserById,
 *   params: { id: "123" }
 * });
 *
 * // With skip to prevent automatic loading
 * const { data, loading, refetch } = useAppwrite({
 *   fn: searchUsers,
 *   skip: true
 * });
 *
 * // Refetch with new parameters
 * await refetch({ query: "new search term" });
 * ```
 */
const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error: ", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  const refetch = async (newParams?: P) => await fetchData(newParams!);

  return { data, loading, error, refetch };
};

export default useAppwrite;
