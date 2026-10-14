import { Container, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { ReceiptLong } from "@mui/icons-material";
import { useExpenseStore } from "../store/expenseStore";
import TransactionList from "./TransactionList";

export default function Transactions() {

  const expenses = useExpenseStore((state) => state.expenses) as {
    amount: number;
    category: string;
    type: string;
  }[];

  const totals = expenses
    .filter((item) => item.type === "expense")
    .reduce(
      (result, item) => {
        result[item.category] =
          (result[item.category] || 0) + Number(item.amount);
        return result;
      },
      {} as Record<string, number>,
    );

  const categories = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = categories.reduce((sum, item) => sum + item[1], 0);

  const chartData = categories.map(([label, value], id) => ({
    id,
    label,
    value,
  }));
  
  return (
    <Container maxWidth="xl" className="page transactions-page">
      <div className="transactions-title-icon">
        <ReceiptLong />
      </div>
      <Typography className="welcome-line">YOUR ACTIVITY</Typography>
      <Typography variant="h3" className="page-title">
        Transactions
      </Typography>
      <Typography className="page-subtitle">
        A clear view of every dollar coming in and going out.
      </Typography>
      <section className="expense-chart">
        <div>
          <Typography className="section-title">
            Expenses by category
          </Typography>
          <Typography className="section-subtitle">
            Share of your recorded expenses
          </Typography>
          {categories.length ? (
            <div className="chart-legend">
              {categories.map(([category, amount]) => (
                <div className="chart-legend-item" key={category}>
                  <span>{category}</span>
                  <strong>
                    {total ? Math.round((amount / total) * 100) : 0}%
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <Typography className="section-subtitle">
              No expenses to chart yet. Add an expense to see the breakdown.
            </Typography>
          )}
        </div>
        {categories.length > 0 && (
          <PieChart
            series={[
              {
                data: chartData,
                arcLabel: (item) =>
                  `${Math.round((item.value / total) * 100)}%`,
                arcLabelMinAngle: 12,
                valueFormatter: (item) =>
                  `${item.value.toLocaleString("en-US")} USD`,
              },
            ]}
            width={260}
            height={220}
          />
        )}
      </section>
      <TransactionList />
    </Container>
  );
}
