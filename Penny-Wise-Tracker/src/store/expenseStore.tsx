import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";

export interface ExpenseItem {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface ExpenseStore {
  expenses: ExpenseItem[];
  loadFromSupabase: () => Promise<void>;
  addExpense: (expense: Omit<ExpenseItem, "id">) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const ExpenseContext = createContext<ExpenseStore | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const loadFromSupabase = async () => {
    if (!supabase) {
      throw new Error("Supabase .env settings are missing.");
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Load error:", error);
      throw error;
    }

    setExpenses((data || []) as ExpenseItem[]);
  };

  const addExpense = async (expense: Omit<ExpenseItem, "id">) => {
    if (!supabase) {
      throw new Error("Supabase .env settings are missing.");
    }

    const type = String(expense.type).toLowerCase();

    if (type !== "income" && type !== "expense") {
      throw new Error(`Invalid transaction type: ${expense.type}`);
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        title: expense.title,
        amount: Number(expense.amount),
        category: expense.category,
        type,
        date: expense.date,
      })
      .select()
      .single();

    if (error) {
      console.error("Add transaction error:", error);
      throw error;
    }

    setExpenses((current) =>
      [data as ExpenseItem, ...current].sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    );
  };

  const deleteExpense = async (id: number) => {
    if (!supabase) {
      throw new Error("Supabase .env settings are missing.");
    }

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      console.error("Delete transaction error:", error);
      throw error;
    }

    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

  useEffect(() => {
    loadFromSupabase().catch((error: unknown) => {
      console.error("Could not load transactions:", error);
    });
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loadFromSupabase,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseStore<T>(selector: (store: ExpenseStore) => T): T {
  const store = useContext(ExpenseContext);

  if (!store) {
    throw new Error("useExpenseStore must be inside ExpenseProvider.");
  }

  return selector(store);
}
