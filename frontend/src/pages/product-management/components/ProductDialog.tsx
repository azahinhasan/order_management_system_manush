import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { createProductApi, editProductApi } from "../../../common/api";
import { useSnackbar } from "../../../context/snack-bar.context";
import CustomFields from "../../../components/CustomFields";
import { ICreateProductDto, IUpdateProductDto } from "../../../common/interface";

const unitOptions = ["KG", "lb", "LITER", "PIECE", "GRAM"];

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: any; 
  refetch: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onClose, product,refetch }) => {
  const { showAlert } = useSnackbar();
  console.log(product, "product");
  const mutation = useMutation({
    mutationFn: (values: ICreateProductDto | IUpdateProductDto) => {
      if (product) {
        return editProductApi(values as IUpdateProductDto, product.id);
      } else {
        return createProductApi(values as ICreateProductDto);
      }
    },
    onSuccess: () => {
      showAlert(
        product ? "Product updated successfully" : "Product created successfully",
        "success"
      );
      formik.resetForm();
      refetch();
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
      perUnit: product?.perUnit ?? "",
      availableQuantity: product?.availableQuantity ?? "",
      unit: product?.unit ?? "GRAM",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      currentPrice: Yup.number().required("Current price is required"),
      perUnit: Yup.number().required("Per unit is required"),
      availableQuantity: Yup.number().required("Quantity is required"),
      unit: Yup.string().oneOf(unitOptions, "Invalid unit").required("Unit is required"),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  console.log(formik.values);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomFields
              fullWidth
              label="Name"
              margin="dense"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomFields
              fullWidth
              label="Available Quantity"
              fieldType="number"
              margin="dense"
              {...formik.getFieldProps("availableQuantity")}
              error={formik.touched.availableQuantity && Boolean(formik.errors.availableQuantity)}
              helperText={formik.touched.availableQuantity && formik.errors.availableQuantity}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <CustomFields
              fullWidth
              label="Current Price"
              fieldType="number"
              margin="dense"
              {...formik.getFieldProps("currentPrice")}
              error={formik.touched.currentPrice && Boolean(formik.errors.currentPrice)}
              helperText={formik.touched.currentPrice && formik.errors.currentPrice}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <div style={{ marginTop: "25px", textAlign: "center" }}>
            per
            </div>
            
          </Grid>
          <Grid item xs={12} sm={5}>
            <CustomFields
              fullWidth
              label="Unit weight"
              fieldType="number"
              margin="dense"
              {...formik.getFieldProps("perUnit")}
              error={formik.touched.perUnit && Boolean(formik.errors.perUnit)}
              helperText={formik.touched.perUnit && formik.errors.perUnit}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomFields
              fieldType="dropdown"
              fullWidth
              label="Unit"
              margin="dense"
              disabled={true}
              options={unitOptions.map((option) => ({
                value: option,
                label: option,
              }))}
              {...formik.getFieldProps("unit")}
              error={formik.touched.unit && Boolean(formik.errors.unit)}
              helperText={formik.touched.unit && formik.errors.unit}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomFields
              fullWidth
              label="Description"
              margin="dense"
              fieldType="textarea"
              {...formik.getFieldProps("description")}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
        </Grid>
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
