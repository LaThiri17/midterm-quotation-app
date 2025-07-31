/*
TODO remove bootstrap and replace with MUI.
*/
import {
  Container,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  Typography,
  Box
} from "@mui/material";
import { CiShoppingCart } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";

function QuotationTable({ data, clearDataItems, deleteByIndex }) {
  if (!data || data.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quotation
        </Typography>
        <Typography variant="body1">
          <CiShoppingCart style={{ verticalAlign: "middle" }} /> No items
        </Typography>
      </Container>
    );
  }

  const totalDiscount = data.reduce((acc, v) => acc + Number(v.discount), 0);
  const total = data.reduce((acc, v) => acc + (v.qty * v.ppu) - v.discount, 0);

  const clearTable = () => {
    clearDataItems();
  };

  const handleDelete = (index) => {
    deleteByIndex(index);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Quotation</Typography>
        <Button
          onClick={clearTable}
          variant="outlined"
          color="inherit"
          startIcon={<MdClear />}
        >
          Clear
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">-</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell>Item</TableCell>
            <TableCell align="center">Price/Unit</TableCell>
            <TableCell align="center">Discount</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((v, i) => {
            const amount = v.qty * v.ppu - v.discount;
            return (
              <TableRow key={i}>
                <TableCell align="center">
                  <BsFillTrashFill
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(i)}
                  />
                </TableCell>
                <TableCell align="center">{v.qty}</TableCell>
                <TableCell>{v.item}</TableCell>
                <TableCell align="center">{v.ppu}</TableCell>
                <TableCell align="center">{v.discount}</TableCell>
                <TableCell align="right">{amount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} align="right">
              <strong>Total Discount</strong>
            </TableCell>
            <TableCell align="right">{totalDiscount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} align="right">
              <strong>Total</strong>
            </TableCell>
            <TableCell align="right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Container>
  );
}

export default QuotationTable;
