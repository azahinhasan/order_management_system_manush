import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  TablePagination,
  MenuItem,
  Select,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useSnackbar } from "../../context/snack-bar.context";
import { editorderApi, orderListApi } from "../../common/api";

const OrderList = () => {
  const { showAlert } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState<{ [key: number]: boolean }>({});

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["ordertList"],
    queryFn: () => orderListApi(page + 1, rowsPerPage),
  });

  const statusUpdate = useMutation<
    unknown,
    unknown,
    { id: number; status: string }
  >({
    mutationFn: ({ id, status }) => editorderApi({ status }, id),
    onSuccess: () => {
      showAlert("Order status updated successfully", "success");
      refetch();
    },
    onError: () => {
      showAlert("Failed to update product status", "error");
    },
  });

  const toggleRow = (id:number) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    refetch();
    console.log(data, "datadata");
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularProgress />;
  if (error) {
    showAlert(error.message, "error");
    return <Typography color="error">Failed to load orders</Typography>;
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <Typography variant="h6" gutterBottom>
        Order Page
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Change Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.orders.map((order:any) => (
              <>
                <TableRow key={order.id}>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(order.id)}
                    >
                      {openRows[order.id] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell><strong>{order.status}</strong></TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        statusUpdate.mutate({
                          id: order.id,
                          status: e.target.value,
                        })
                      }
                      displayEmpty
                      fullWidth
                      variant="outlined"
                      size="small"
                    >
                      {["Pending", "Processing", "Delivered", "Cancelled"].map(
                        (status) => {
                          return (
                            <MenuItem key={status} value={status.toUpperCase()}>
                              {status}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={openRows[order.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Order Items
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell align="right">Unit Price</TableCell>
                              <TableCell align="right">Total Price</TableCell>
                              <TableCell align="right">
                                Total Offer(w+p+f)
                              </TableCell>
                              <TableCell align="right">After Offer</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order?.items.map((item:any) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.product.name}</TableCell>
                                <TableCell>{item.orderQuantity}</TableCell>
                                <TableCell align="right">
                                  {item.unitPrice} bdt / {item.perUnit}{" "}
                                  {item.product?.unit?.toLowerCase()}
                                </TableCell>
                                <TableCell align="right">
                                  {item.totalPrice}
                                </TableCell>
                                <TableCell align="right">
                                  {item.weightedDiscount}+
                                  {item.percentageDiscount}+{item.fixedDiscount}
                                </TableCell>
                                <TableCell align="right">
                                  {item.totalPrice -
                                    (item.weightedDiscount +
                                      item.percentageDiscount +
                                      item.fixedDiscount)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow key={"total"}>
                              <TableCell colSpan={3} align="right"></TableCell>
                              <TableCell colSpan={1}>
                                <strong>
                                  Total Bill :
                                  {order?.items.reduce(
                                    (sum:number, product:any) => sum + product.totalPrice,
                                    0
                                  )}{" "}
                                  tk
                                </strong>
                              </TableCell>
                              <TableCell>
                                <strong>
                                  Total Discount :
                                  {order?.items.reduce(
                                    (sum:number, product:any) =>
                                      sum + product.weightedDiscount,
                                    0
                                  )}
                                </strong>
                              </TableCell>
                              <TableCell>
                                <strong>
                                  Grand total :
                                  {order?.items.reduce(
                                    (sum:number, product:any) =>
                                      sum +
                                      (product.totalPrice -
                                        product.weightedDiscount),
                                    0
                                  )}{" "}
                                  tk
                                </strong>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 20, 30]}
          component="div"
          count={data.totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </TableContainer>
    </div>
  );
};

export default OrderList;
