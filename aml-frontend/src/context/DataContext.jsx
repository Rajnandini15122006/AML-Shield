import {
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";

import axios from "axios";

export const DataContext = createContext();

export default function DataProvider({ children }) {

  const [datasetUploaded, setDatasetUploaded] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/transactions");
      const data = response.data;
      setTransactions(data);
      if (data.length > 0) {
        setDatasetUploaded(true);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on app start
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <DataContext.Provider
      value={{
        datasetUploaded,
        setDatasetUploaded,
        transactions,
        setTransactions,
        loading,
        fetchTransactions
      }}
    >
      {children}
    </DataContext.Provider>
  );
}