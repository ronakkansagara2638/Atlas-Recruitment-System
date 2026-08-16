import React from "react";
import { Card } from "./Card";

export function EmptyState({ text }) {
  return (
    <Card style={{ padding: 36, textAlign: "center", color: "var(--muted2)", fontSize: 13.5 }}>{text}</Card>
  );
}
