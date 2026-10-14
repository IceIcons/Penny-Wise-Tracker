import { Box, Button, Container, Typography } from "@mui/material";
import {
  Add,
  ArrowForward,
  CalendarMonth,
  WavingHand,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import SummaryCards from "./SummaryCards";
import TransactionList from "./TransactionList";

interface Props {
  onAdd: () => void;
}

function Dashboard({ onAdd }: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  return (
    <Container maxWidth="xl" className="page">
      <div className="topline">
        <span className="eyebrow">
          <CalendarMonth fontSize="small" /> {today}
        </span>
        <span className="avatar">PW</span>
      </div>
      <Box className="page-heading">
        <Box>
          <Typography className="welcome-line">
            YOUR MONEY, IN FOCUS <WavingHand fontSize="small" />
          </Typography>
          <Typography variant="h3" className="page-title">
            Good to see you.
          </Typography>
          <Typography className="page-subtitle">
            Here’s the latest snapshot of your finances.
          </Typography>
        </Box>
        <Button
          className="primary-action"
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Add transaction
        </Button>
      </Box>
      <SummaryCards />
      <div className="insight-banner">
        <div className="insight-symbol">
          <span>✳</span>
        </div>
        <div>
          <strong>Make every dollar count</strong>
          <p>
            Review your latest activity and keep your budget moving in the right
            direction.
          </p>
        </div>
        <Link to="/transactions">
          Explore activity <ArrowForward fontSize="small" />
        </Link>
      </div>
      <TransactionList limit={5} />
      <Box className="view-all">
        <Button component={Link} to="/transactions" endIcon={<ArrowForward />}>
          See all transactions
        </Button>
      </Box>
    </Container>
  );
}
export default Dashboard;
