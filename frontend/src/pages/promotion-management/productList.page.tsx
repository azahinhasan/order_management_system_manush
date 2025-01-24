import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Switch,
  TablePagination,
  Button,
  Box,
} from "@mui/material";
import { useSnackbar } from "../../context/snack-bar.context";
import { promotionListApi, editPromotionApi } from "../../common/api";
import PromotionDialog from "./components/PromotionDialog";

const PromotionList = () => {
  const { showAlert } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["promotionList"],
    queryFn: () => promotionListApi(),
  });

  const statusUpdate = useMutation<
    unknown,
    unknown,
    { id: number; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => editPromotionApi({ isActive }, id),
    onSuccess: () => {
      showAlert("Promotion status updated successfully", "success");
      refetch();
    },
    onError: () => {
      showAlert("Failed to update promotion status", "error");
    },
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularProgress />;
  if (error) {
    showAlert(error.message, "error");
    return <Typography color="error">Failed to load promotions</Typography>;
  }
  console.log(data);
  return (
    <div>
      <CardContent style={{marginTop: "20px"}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Promotion List
          </Typography>
          <Button
            size="small"
            disabled={isLoading}
            variant="outlined"
            color="primary"
            onClick={() => {
              setSelectedPromotion(null);
              setOpenDialog(true);
            }}
          >
            + Add
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Price per Unit</TableCell>
                <TableCell>Range</TableCell>
                <TableCell>Offer Date</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.promotions?.map((promotion: any) => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.title}</TableCell>
                  <TableCell>{promotion.discountAmount} bdt / {promotion.perQuantity} {promotion.unit.toLowerCase()}</TableCell>
                  <TableCell>{promotion.minimumRange} - {promotion.maximumRange}</TableCell>
                  <TableCell>
                    {promotion.startDate.split("T")[0]} to {promotion.endDate.split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={promotion.isActive}
                      onChange={() =>
                        statusUpdate.mutate({
                          id: promotion.id,
                          isActive: !promotion.isActive,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setSelectedPromotion(promotion);
                        setOpenDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[3, 20, 30]}
          component="div"
          count={data.totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 3))
          }
        />
      </CardContent>
      <PromotionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        promotion={selectedPromotion}
        refetch={refetch}
      />
    </div>
  );
};

export default PromotionList;
