import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useProductContext } from "../../context/product.context";
import YesNoDialog from "../../components/YesNoDialog";
import { createOrderApi } from "../../common/api";
import { useMutation } from "@tanstack/react-query";
import { IOrderItem } from "../../common/interface";
import { useSnackbar } from "../../context/snack-bar.context";

const PurchasePage = () => {
  const { showAlert } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const { promotionData, promotionLoading, promotionError } =
    useProductContext();
  const [discountedProducts, setDiscountedProducts] = useState<IOrderItem[]>(
    []
  );

  const mutation = useMutation({
    mutationFn: () =>
      createOrderApi(
        discountedProducts.map((product) => {
          delete product.productName;
          delete product.unit;
          return product;
        })
      ),
    onSuccess: () => {
      showAlert("Order created successfully", "success");
      setDiscountedProducts([]);
      localStorage.removeItem("orders");
    },
    onError: (err) => {
      showAlert(err.message || "Failed to create order", "error");
    },
  });

  function applyPromotionToOrder(promotion: any[], products: any[]): any[] {
    const tempDiscountedProducts: any[] = [];
    const byWeight = promotion?.filter((el) => el.type === "WEIGHTED");

    products.forEach((product) => {
      const matchedSlab = byWeight?.find(
        (el) =>
          product.orderQuantity >= el.minimumRange &&
          product.orderQuantity <= el.maximumRange
      );

      let weightedDiscount = 0;
      let totalPrice = 0;
      const fixedDiscount = 0;
      const percentageDiscount = 0;
      if (matchedSlab) {
        totalPrice =
          (product.orderQuantity * product.unitPrice) / product.perUnit;
        weightedDiscount =
          (product.orderQuantity * matchedSlab.discountAmount) /
          matchedSlab.perQuantity;
      }
      tempDiscountedProducts.push({
        ...product,
        weightedDiscount: parseFloat(weightedDiscount.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        fixedDiscount: parseFloat(fixedDiscount.toFixed(2)),
        percentageDiscount: parseFloat(percentageDiscount.toFixed(2)),
      });
    });
    return tempDiscountedProducts;
  }

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      const discountedProducts = applyPromotionToOrder(promotionData, orders);
      setDiscountedProducts(discountedProducts);
    }
  }, [promotionData, promotionLoading, promotionError]);

  const removeItemHandler = (id: number) => {
    setDiscountedProducts((prevState) =>
      prevState.filter((item) => item.productId !== id)
    );
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      const filteredOrders = orders.filter(
        (order: any) => order.productId !== id
      );
      localStorage.setItem("orders", JSON.stringify(filteredOrders));
    }
  };

  if (promotionLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (promotionError) {
    return (
      <div style={{ padding: "20px" }}>
        <Typography color="error">Error loading promotion data</Typography>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography variant="h6" gutterBottom>
        Cart
      </Typography>
      <TableContainer component={Paper} style={{ padding: "20px" }}>
        {discountedProducts.length === 0 ? (
          <Typography>No products in the cart</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Unit Price (tk)</TableCell>
                <TableCell>Order Quantity</TableCell>
                <TableCell>Total Price (tk)</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Price After Discount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {discountedProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>
                    {product.unitPrice} / {product.perUnit} {product.unit}
                  </TableCell>
                  <TableCell>
                    {product.orderQuantity} {product.unit}
                  </TableCell>
                  <TableCell>{product.totalPrice}</TableCell>
                  <TableCell>{product.weightedDiscount}</TableCell>
                  <TableCell>
                    {product.totalPrice - product.weightedDiscount}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeItemHandler(product.productId)}
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow key={"total"}>
                <TableCell colSpan={3} align="right">
                  <strong>Total:</strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {parseFloat(
                      discountedProducts
                        .reduce((sum, product) => sum + product.totalPrice, 0)
                        .toFixed(2)
                    )}{" "}
                    tk
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {parseFloat(
                      discountedProducts
                        .reduce(
                          (sum, product) => sum + product.weightedDiscount,
                          0
                        )
                        .toFixed(2)
                    )}{" "}
                    tk
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>
                    {parseFloat(
                      discountedProducts
                        .reduce(
                          (sum, product) =>
                            sum +
                            (product.totalPrice - product.weightedDiscount),
                          0
                        )
                        .toFixed(2)
                    )}{" "}
                    tk
                  </strong>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenDialog(true)}
                  >
                    Confirm
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <YesNoDialog
        open={openDialog}
        title="Confirm Order"
        content="Are you sure you want to place the order?"
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          mutation.mutate();
          setOpenDialog(false);
        }}
      />
    </div>
  );
};

export default PurchasePage;
