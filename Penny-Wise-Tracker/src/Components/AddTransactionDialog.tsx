import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";
import { useExpenseStore } from "../store/expenseStore";
import { toast } from "react-toastify";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Work",
  "Health",
  "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  title: string;
  amount: string;
  category: string;
  type: "expense" | "income";
  date: string;
}

function AddTransactionDialog({ open, onClose }: Props) {
  const addExpense = useExpenseStore((state) => state.addExpense);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      amount: "",
      category: "Food",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (open)
      reset({
        title: "",
        amount: "",
        category: "Food",
        type: "expense",
        date: new Date().toISOString().slice(0, 10),
      });
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await addExpense({ ...data, amount: Number(data.amount) });
      toast.success(
        `${data.type === "income" ? "Income" : "Expense"} added successfully`,
      );
      onClose();
    } catch {
      toast.error("Could not save transaction. Check your Supabase setup.");
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="dialog-heading">
        <span className="dialog-kicker">PENNYWISE / ENTRY</span>
        <br />
        Add a transaction
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <p className="dialog-description">
            Add a little detail to keep your money picture up to date.
          </p>
          <Box className="expense-form">
            <TextField
              label="Description"
              placeholder="e.g. Weekly groceries"
              fullWidth
              {...register("title", { required: "Please enter a description" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Enter an amount above zero" },
              })}
              error={!!errors.amount}
              helperText={errors.amount?.message}
              slotProps={{
                htmlInput: { min: 0.01, step: 0.01 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              label="Category"
              fullWidth
              {...register("category")}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Transaction type"
              fullWidth
              {...register("type")}
            >
              <MenuItem value="expense">Expense — money out</MenuItem>
              <MenuItem value="income">Income — money in</MenuItem>
            </TextField>
            <TextField
              label="Date"
              type="date"
              fullWidth
              {...register("date", { required: "Please choose a date" })}
              error={!!errors.date}
              helperText={errors.date?.message}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save transaction
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
export default AddTransactionDialog;
