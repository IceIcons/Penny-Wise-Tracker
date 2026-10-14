import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  DeleteOutlined,
  Restaurant,
  DirectionsBus,
  ShoppingBag,
  Receipt,
  SportsEsports,
  Category,
  Work,
  Search,
  Close,
  FavoriteBorder,
  HealthAndSafety,
} from "@mui/icons-material";
import { useExpenseStore } from "../store/expenseStore";
import { toast } from "react-toastify";

interface ExpenseItem {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface Props {
  limit?: number;
}

type FilterType = "all" | "income" | "expense";

const categoryIcons: Record<string, typeof Restaurant> = {
  Food: Restaurant,
  Transport: DirectionsBus,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: SportsEsports,
  Other: Category,
  Work,
  Health: HealthAndSafety,
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

function TransactionList({ limit }: Props) {
  const expenses = useExpenseStore((state) => state.expenses) as ExpenseItem[];
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ExpenseItem | null>(null);

  const filtered = useMemo(
    () =>
      [...expenses]
        .filter(
          (item) =>
            (filter === "all" || item.type === filter) &&
            (categoryFilter === "all" || item.category === categoryFilter) &&
            (!dateFilter || item.date === dateFilter) &&
            `${item.title} ${item.category}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, filter, search, categoryFilter, dateFilter],
  );

  const visible = limit ? filtered.slice(0, limit) : filtered;

  const confirmDelete = () => {
    if (!pendingDelete) return;
    Promise.resolve(deleteExpense(pendingDelete.id))
      .then(() => {
        toast.success(`“${pendingDelete.title}” deleted`);
        setPendingDelete(null);
      })
      .catch(() =>
        toast.error("Could not delete transaction. Check your connection."),
      );
  };

  return (
    <Box className="transactions">
      <Box className="list-heading">
        <div>
          <Typography variant="h5" className="section-title">
            {limit ? "Latest activity" : "All activity"}
          </Typography>
          <Typography className="section-subtitle">
            {limit
              ? "Your five most recent entries"
              : `${filtered.length} transaction${filtered.length === 1 ? "" : "s"} found`}
          </Typography>
        </div>
        {!limit && (
          <div className="transaction-filters">
            <TextField
              size="small"
              type="date"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All categories</MenuItem>
              {[...new Set(expenses.map((item) => item.category))]
                .sort()
                .map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              size="small"
              placeholder="Search entries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
            >
              <MenuItem value="all">All types</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expenses</MenuItem>
            </TextField>
          </div>
        )}
      </Box>
      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FavoriteBorder />
          </div>
          <strong>No transactions here yet</strong>
          <p>Try another filter or add a new transaction to get started.</p>
        </div>
      ) : (
        <div className="transaction-stack">
          {visible.map((item, index) => {
            const Icon = categoryIcons[item.category] || Category;
            const dayLabel = (date: string) => {
              const itemDay = new Date(`${date}T00:00:00`);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);
              if (itemDay.getTime() === today.getTime()) return "Today";
              if (itemDay.getTime() === yesterday.getTime()) return "Yesterday";
              return itemDay.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
            };
            const previousItem = visible[index - 1];
            return (
              <div key={item.id}>
                {(!previousItem || previousItem.date !== item.date) && (
                  <div className="date-group-heading">
                    {dayLabel(item.date)}
                  </div>
                )}
                <Card className="transaction-card">
                  <Box className={`transaction-icon ${item.type}`}>
                    <Icon />
                  </Box>
                  <Box className="transaction-info">
                    <Typography className="transaction-name">
                      {item.title}
                    </Typography>
                    <Typography className="transaction-meta">
                      {item.category}
                      <span>•</span>
                      {item.date}
                    </Typography>
                  </Box>
                  <Box className="transaction-right">
                    <Typography className={`transaction-amount ${item.type}`}>
                      {item.type === "income" ? "+" : "−"}
                      {money(Number(item.amount))}
                    </Typography>
                    <Typography className="transaction-kind">
                      {item.type === "income" ? "INCOME" : "EXPENSE"}
                    </Typography>
                  </Box>
                  <IconButton
                    className="delete-button"
                    onClick={() => setPendingDelete(item)}
                    aria-label={`Delete ${item.title}`}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      <Dialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { className: "delete-dialog" } }}
      >
        <div className="delete-dialog-top">
          <div className="warning-mark">
            <DeleteOutlined />
          </div>
          <IconButton
            onClick={() => setPendingDelete(null)}
            aria-label="Close dialog"
          >
            <Close />
          </IconButton>
        </div>
        <DialogTitle className="delete-title">
          Delete this transaction?
        </DialogTitle>
        <DialogContent>
          <Typography className="delete-copy">
            You’re about to permanently remove{" "}
            <strong>{pendingDelete?.title}</strong> (
            {pendingDelete ? money(Number(pendingDelete.amount)) : ""}). This
            action can’t be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="delete-actions">
          <Button onClick={() => setPendingDelete(null)} variant="outlined">
            Keep it
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteOutlined />}
          >
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default TransactionList;
