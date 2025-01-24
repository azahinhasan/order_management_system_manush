import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../../context/snack-bar.context";
import CustomFields from "../../../components/CustomFields";
import { IProductDto } from "../../../common/interface";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: IProductDto;
}

const AddSingleProductForOrder: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
}) => {
  const { showAlert } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      orderQuantity: "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      orderQuantity: Yup.number()
        .typeError("Quantity must be a valid number")
        .required("Quantity is required")
        .min(1, "Quantity must be at least 1")
        .max(
          product.availableQuantity,
          `Available quantity is ${product.availableQuantity}`
        ),
    }),
    onSubmit: (values) => {
      const orderQuantity = parseInt(values.orderQuantity, 10);
      const storedOrders = localStorage.getItem("orders");
      const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

      const existingIndex = existingOrders.findIndex(
        (item: any) => item.productId === product.id
      );
      if (existingIndex !== -1) {
        showAlert("Product already added", "error");
      } else {
        existingOrders.push({
          productName: product.name,
          productId: product.id,
          unitPrice: product.currentPrice,
          perUnit: product.perUnit,
          unit: product.unit,
          orderQuantity,
        });
        showAlert("Product added", "success");
        formik.resetForm();
        onClose();
      }
      localStorage.setItem("orders", JSON.stringify(existingOrders));
    },
  });

  console.log(formik.values);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <CustomFields
          fullWidth
          label={"Quantity (in " + product.unit?.toLocaleLowerCase() + ")"}
          margin="dense"
          fieldType="number"
          {...formik.getFieldProps("orderQuantity")}
          error={
            formik.touched.orderQuantity && Boolean(formik.errors.orderQuantity)
          }
          helperText={
            formik.touched.orderQuantity && formik.errors.orderQuantity
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            formik.resetForm();
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={() => formik.handleSubmit()} color="primary">
          Add{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSingleProductForOrder;
