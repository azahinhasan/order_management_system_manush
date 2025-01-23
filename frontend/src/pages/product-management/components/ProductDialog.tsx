import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { createProductApi, editProductApi } from "../../../common/api";
import { useSnackbar } from "../../../context/snack-bar.context";
import CustomFields from "../../../common/components/CustomFields";
import { ICreateProductDto } from "../../../common/interface";

const unitOptions = ["KG", "lb", "LITER", "PIECE","GRAM"];

const ProductDialog = ({ open, onClose, product }) => {
  const { showAlert } = useSnackbar();
  console.log(product, "product");
  const mutation = useMutation({
    mutationFn: (values:ICreateProductDto) =>
      product ? editProductApi(values, product.id) : createProductApi(values),
    onSuccess: () => {
      showAlert(
        product
          ? "Product updated successfully"
          : "Product created successfully",
        "success"
      );
      formik.resetForm();
      onClose();
    },
    onError: () => {
      showAlert("Failed to submit product", "error");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      currentPrice: product?.currentPrice ?? "",
      availableQuantity: product?.availableQuantity ?? "",
      unit: product?.unit ?? "KG",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      currentPrice: Yup.number().required("Current price is required"),
      availableQuantity: Yup.number().required("Quantity is required"),
      unit: Yup.string()
        .oneOf(unitOptions, "Invalid unit")
        .required("Unit is required"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  console.log(formik.values)
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
      <DialogContent>
        <CustomFields
          fullWidth
          label="Name"
          margin="dense"
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <CustomFields
          fullWidth
          label="Description"
          margin="dense"
          fieldType="textarea"
          {...formik.getFieldProps("description")}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />

        <CustomFields
          fullWidth
          label="Current Price"
          fieldType="number"
          margin="dense"
          {...formik.getFieldProps("currentPrice")}
          error={
            formik.touched.currentPrice && Boolean(formik.errors.currentPrice)
          }
          helperText={formik.touched.currentPrice && formik.errors.currentPrice}
        />

        <CustomFields
          fullWidth
          label="Available Quantity"
          fieldType="number"
          margin="dense"
          {...formik.getFieldProps("availableQuantity")}
          error={
            formik.touched.availableQuantity &&
            Boolean(formik.errors.availableQuantity)
          }
          helperText={
            formik.touched.availableQuantity && formik.errors.availableQuantity
          }
        />

        <CustomFields
          fieldType="dropdown"
          fullWidth
          label="Unit"
          margin="dense"
          disabled={product}
          options={unitOptions.map((option) => ({
            value: option,
            label: option,
          }))}
          {...formik.getFieldProps("unit")}
          error={formik.touched.unit && Boolean(formik.errors.unit)}
          helperText={formik.touched.unit && formik.errors.unit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <CircularProgress size={24} />
          ) : product ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
