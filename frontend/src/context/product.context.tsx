import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { availablePromotionListApi } from "../common/api"; // Assuming you have this API

interface ProductContextType {
  promotionData: any[];
  promotionError: any;  
  promotionLoading: boolean;
  refetchPromotion: () => void;
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
  const {
    data: promotionData = [],    
    error: promotionError,       
    isLoading: promotionLoading, 
    refetch: refetchPromotion,   
  } = useQuery({
    queryKey: ["promotionList"], 
    queryFn: availablePromotionListApi,
  });

  return (
    <ProductContext.Provider
      value={{
        promotionData:promotionData.promotions,
        promotionError,
        promotionLoading,
        refetchPromotion,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
