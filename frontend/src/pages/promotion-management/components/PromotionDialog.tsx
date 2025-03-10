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
import { createPromotionApi, editPromotionApi } from "../../../common/api";
import { useSnackbar } from "../../../context/snack-bar.context";
import CustomFields from "../../../components/CustomFields";
import {
  ICreatePromotionDto,
  IUpdatePromotionDto,
} from "../../../common/interface";

const unitOptions = ["GRAM"];
const typesOptions = ["WEIGHTED", "FIXED", "PERCENTAGE"];

interface PromotionDialogProps {
  open: boolean;
  onClose: () => void;
  promotion?: any;
  refetch: () => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({
  open,
  onClose,
  promotion,
  refetch,
}) => {
  const { showAlert } = useSnackbar();
  const mutation = useMutation({
    mutationFn: (values: ICreatePromotionDto | IUpdatePromotionDto) => {
      values = {
        ...values,
        startDate: values.startDate + "T00:00:00.000Z",
        endDate: values.endDate + "T23:59:59.000Z",
      };
      return promotion
        ? editPromotionApi(values as IUpdatePromotionDto, promotion.id)
        : createPromotionApi(values as ICreatePromotionDto);
    },
    onSuccess: () => {
      showAlert(
        promotion
          ? "Promotion updated successfully"
          : "Promotion created successfully",
        "success"
      );
      formik.resetForm();
      refetch();
      onClose();
    },
    onError: (err) => {
      showAlert(err.message || "Failed to submit promotion", "error");
    },
  });

  const formik = useFormik({
    initialValues: {
      title: promotion?.title ?? "",
      secondTitle: promotion?.secondTitle ?? "",
      minimumRange: promotion?.minimumRange ?? "",
      maximumRange: promotion?.maximumRange ?? "",
      discountAmount: promotion?.discountAmount ?? "",
      perQuantity: promotion?.perQuantity ?? "",
      description: promotion?.description ?? "",
      startDate:
        promotion?.startDate.split("T")[0] ??
        new Date().toISOString().split("T")[0],
      endDate:
        promotion?.endDate.split("T")[0] ??
        new Date().toISOString().split("T")[0],
      unit: promotion?.unit ?? "",
      type: promotion?.type ?? "WEIGHTED",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      secondTitle: Yup.string().required("Second title is required"),
      discountAmount: Yup.number()
        .min(1, "Discount amount must be at least 1")
        .required("Discount amount is required"),
      description: Yup.string().required("Description is required"),
      startDate: Yup.date()
        .required("Start date is required")
        .max(Yup.ref("endDate"), "Start date cannot be after end date"),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date cannot be before start date"),
      type: Yup.string()
        .oneOf(typesOptions, "Invalid type")
        .required("Type is required"),
      //-----------------------------------------------------------------------//
      minimumRange: Yup.number()
        .min(0, "Minimum range must be at least 0")
        .max(
          Yup.ref("maximumRange"),
          "Mix range cannot be more than Max range"
        ),
      maximumRange: Yup.number()
        .min(Yup.ref("minimumRange"), "Max range cannot be less than Min range")
        .min(1, "Maximum range must be at least 1"),
      perQuantity: Yup.number().min(1, "Per quantity must be at least 1"),
      unit: Yup.string().oneOf(unitOptions, "Invalid unit"),
    }),
    onSubmit: (values) => {
      if (values.type !== "WEIGHTED") {
        delete values.minimumRange;
        delete values.maximumRange;
        delete values.perQuantity;
        delete values.unit;
      }
      mutation.mutate(values);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {promotion ? "Edit Promotion" : "Create Promotion"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <CustomFields
              fullWidth
              label="Title"
              margin="dense"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomFields
              fullWidth
              label="Second Title"
              margin="dense"
              disabled={promotion}
              {...formik.getFieldProps("secondTitle")}
              error={
                formik.touched.secondTitle && Boolean(formik.errors.secondTitle)
              }
              helperText={
                formik.touched.secondTitle && formik.errors.secondTitle
              }
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomFields
              fullWidth
              label="Description"
              fieldType="textarea"
              margin="dense"
              disabled={promotion}
              {...formik.getFieldProps("description")}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomFields
              fieldType="dropdown"
              fullWidth
              label="Type"
              margin="dense"
              disabled={promotion}
              options={typesOptions.map((option) => ({
                value: option,
                label: option,
              }))}
              {...formik.getFieldProps("type")}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <CustomFields
              fullWidth
              label="Min Range"
              fieldType="number"
              margin="dense"
              disabled={promotion || formik.values.type !== "WEIGHTED"}
              {...formik.getFieldProps("minimumRange")}
              error={
                formik.touched.minimumRange &&
                Boolean(formik.errors.minimumRange)
              }
              helperText={
                formik.touched.minimumRange && formik.errors.minimumRange
              }
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <CustomFields
              fullWidth
              label="Max Range"
              fieldType="number"
              margin="dense"
              disabled={promotion || formik.values.type !== "WEIGHTED"}
              {...formik.getFieldProps("maximumRange")}
              error={
                formik.touched.maximumRange &&
                Boolean(formik.errors.maximumRange)
              }
              helperText={
                formik.touched.maximumRange && formik.errors.maximumRange
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomFields
              fullWidth
              label="Discount Amount"
              fieldType="number"
              margin="dense"
              disabled={promotion}
              {...formik.getFieldProps("discountAmount")}
              error={
                formik.touched.discountAmount &&
                Boolean(formik.errors.discountAmount)
              }
              helperText={
                formik.touched.discountAmount && formik.errors.discountAmount
              }
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <CustomFields
              fullWidth
              label="Per Quantity"
              fieldType="number"
              margin="dense"
              disabled={promotion || formik.values.type !== "WEIGHTED"}
              {...formik.getFieldProps("perQuantity")}
              error={
                formik.touched.perQuantity && Boolean(formik.errors.perQuantity)
              }
              helperText={
                formik.touched.perQuantity && formik.errors.perQuantity
              }
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <CustomFields
              fieldType="dropdown"
              fullWidth
              label="Unit"
              margin="dense"
              disabled={promotion || formik.values.type !== "WEIGHTED"}
              options={unitOptions.map((option) => ({
                value: option,
                label: option,
              }))}
              {...formik.getFieldProps("unit")}
              error={formik.touched.unit && Boolean(formik.errors.unit)}
              helperText={formik.touched.unit && formik.errors.unit}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomFields
              fullWidth
              label="Start Date"
              fieldType="date"
              margin="dense"
              {...formik.getFieldProps("startDate")}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomFields
              fullWidth
              label="End Date"
              fieldType="date"
              margin="dense"
              {...formik.getFieldProps("endDate")}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            formik.handleSubmit();
          }}
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <CircularProgress size={24} />
          ) : promotion ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromotionDialog;
