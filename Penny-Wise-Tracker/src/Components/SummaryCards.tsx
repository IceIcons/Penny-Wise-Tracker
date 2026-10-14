import { Card, CardContent, Typography } from "@mui/material";
import {
  AccountBalanceWallet,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useExpenseStore } from "../store/expenseStore";

interface ExpenseType {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  date: string;
}

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
  
function SummaryCards() {
  const expenses = useExpenseStore((state) => state.expenses) as ExpenseType[];

  const income = expenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const spent = expenses
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const cards = [
    {
      title: "Available balance",
      amount: income - spent,
      note: "Income minus spending",
      icon: <AccountBalanceWallet />,
      kind: "balance",
    },
    {
      title: "Money in",
      amount: income,
      note: "Total recorded income",
      icon: <ArrowDownward />,
      kind: "income",
    },
    {
      title: "Money out",
      amount: spent,
      note: "Total recorded expenses",
      icon: <ArrowUpward />,
      kind: "expense",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((item) => (
        <Card key={item.kind} className={`summary-card ${item.kind}`}>
          <CardContent>
            <div className="summary-card-top">
              <span className="summary-icon">{item.icon}</span>
              <span className="summary-dot" />
            </div>
            <Typography className="summary-label">{item.title}</Typography>
            <Typography className="summary-amount">
              {money(item.amount)}
            </Typography>
            <Typography className="summary-note">{item.note}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default SummaryCards;
