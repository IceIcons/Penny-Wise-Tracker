import { Box, Button, Typography } from "@mui/material";
import {
  Add,
  SpaceDashboard,
  ReceiptLong,
  AccountBalanceWallet,
  TrendingUp,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  onAdd: () => void;
}

function Header({ onAdd }: HeaderProps) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark">
          <AccountBalanceWallet />
        </div>
        <div>
          <Typography className="brand-name">Pennywise</Typography>
          <span className="brand-subtitle">MONEY STUDIO</span>
        </div>
      </div>
      <div className="sidebar-label">WORKSPACE</div>
      <Box className="nav-links">
        <NavLink to="/" end>
          <SpaceDashboard />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/transactions">
          <ReceiptLong />
          <span>Transactions</span>
        </NavLink>
      </Box>
      <div className="sidebar-bottom">
        <div className="mini-tip">
          <div className="tip-icon">
            <TrendingUp />
          </div>
          <strong>Small steps add up.</strong>
          <p>Keep an eye on where your money goes.</p>
        </div>
        <Button
          className="sidebar-add"
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          New transaction
        </Button>
        <Typography className="sidebar-foot">
          PERSONAL FINANCE · 2026
        </Typography>
      </div>
    </aside>
  );
}
export default Header;
