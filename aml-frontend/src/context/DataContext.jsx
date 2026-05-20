// import {
//   createContext,
//   useState
// } from "react";

// export const DataContext =
//   createContext();

// export default function DataProvider({
//   children
// }) {

//   const [datasetUploaded,
//     setDatasetUploaded] =
//     useState(false);

//   const [transactions,
//     setTransactions] =
//     useState([]);

//   return (

//     <DataContext.Provider
//       value={{

//         datasetUploaded,
//         setDatasetUploaded,

//         transactions,
//         setTransactions

//       }}
//     >

//       {children}

//     </DataContext.Provider>

//   );
// }



import {
  createContext,
  useState
} from "react";

export const DataContext =
  createContext();

export default function DataProvider({
  children
}) {

  const [datasetUploaded,
    setDatasetUploaded] =
    useState(false);

  const [transactions,
    setTransactions] =
    useState([]);

  return (

    <DataContext.Provider
      value={{

        datasetUploaded,
        setDatasetUploaded,

        transactions,
        setTransactions

      }}
    >

      {children}

    </DataContext.Provider>

  );
}