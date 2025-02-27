"use client";

import { Provider } from "react-redux";
import { makeStore } from "./store"; // Now this import works

const store = makeStore(); // Ensure a single store instance

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
