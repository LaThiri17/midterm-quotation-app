import { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  Typography
} from "@mui/material";
import QuotationTable from "./QuotationTable";

function App() {
  const itemRef = useRef();
  const ppuRef = useRef();
  const qtyRef = useRef();
  const discountRef = useRef();

  const [products, setProducts] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [ppu, setPpu] = useState(0);
  const [dataItems, setDataItems] = useState([]);

  // Load product list from local JSON
  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedCode(data[0].code);
          setPpu(data[0].price);
        }
      });
  }, []);

  const calculateTotalPrice = (ppu, qty, discount) => ppu * qty - discount;

  const addItem = () => {
    const item = products.find((v) => selectedCode === v.code);
    if (!item) return;

    const ppu = Number(ppuRef.current.value);
    const qty = Number(qtyRef.current.value);
    const discount = Number(discountRef.current.value);
    const totalPrice = calculateTotalPrice(ppu, qty, discount);

    const newItem = { item: item.name, ppu, qty, discount, totalPrice };

    const existingItemIndex = dataItems.findIndex(
      (v) => v.item === newItem.item && v.ppu === newItem.ppu
    );    

    if (existingItemIndex !== -1) {
      const updatedItems = [...dataItems];
      updatedItems[existingItemIndex].qty += newItem.qty;
      updatedItems[existingItemIndex].discount += newItem.discount;
      updatedItems[existingItemIndex].totalPrice = calculateTotalPrice(
        updatedItems[existingItemIndex].ppu,
        updatedItems[existingItemIndex].qty,
        updatedItems[existingItemIndex].discount
      );
      setDataItems(updatedItems);
    } else {
      setDataItems([...dataItems, newItem]);
    }
  };

  const clearDataItems = () => setDataItems([]);

  const deleteByIndex = (index) => {
    setDataItems(dataItems.filter((_, i) => i !== index));
  };

  const productChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    const item = products.find((v) => v.code === code);
    if (item) {
      setPpu(item.price);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Sidebar Input Form */}
        <Grid item xs={12} md={4} sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Item
          </Typography>

          {products.length > 0 && (
            <TextField
              select
              label="Item"
              inputRef={itemRef}
              onChange={productChange}
              value={selectedCode}
              fullWidth
              margin="normal"
            >
              {products.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name} - {p.price} Baht
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            label="Price Per Unit"
            type="number"
            inputRef={ppuRef}
            value={ppu}
            onChange={(e) => setPpu(Number(e.target.value))}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Quantity"
            type="number"
            inputRef={qtyRef}
            defaultValue={1}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Discount"
            type="number"
            inputRef={discountRef}
            defaultValue={0}
            fullWidth
            margin="normal"
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={addItem}
          >
            Add
          </Button>
        </Grid>

        {/* Quotation Table */}
        <Grid item xs={12} md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            deleteByIndex={deleteByIndex}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
