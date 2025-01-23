import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface ProductContextType {
  refetchAllProduct: boolean;
  setRefetchAllProduct: (value: boolean) => void;
  refetchMyAllProduct: boolean;
  setRefetchMyAllProduct: (value: boolean) => void;
  refetchTransaction: boolean;
  setRefetchTransaction: (value: boolean) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [refetchAllProduct, setRefetchAllProduct] = useState<boolean>(false);
  const [refetchMyAllProduct, setRefetchMyAllProduct] = useState<boolean>(false);
  const [refetchTransaction, setRefetchTransaction] = useState<boolean>(false);


  const value = useMemo(() => ({
    refetchAllProduct,
    setRefetchAllProduct,
    refetchMyAllProduct,
    setRefetchMyAllProduct,
    setRefetchTransaction,
    refetchTransaction
  }), [refetchAllProduct, refetchMyAllProduct,refetchTransaction]); 

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
