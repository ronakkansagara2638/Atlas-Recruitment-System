import React from "react";

export function Button({ children, variant = "primary", size = "md", icon: Icon, ...rest }) {
  const sizes = { sm: "6px 12px", md: "9px 16px" };
  const fontSizes = { sm: 12.5, md: 13.5 };
  const variants = {
    primary: { background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)" },
    outline: { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border-strong)" },
    ghost:   { background: "transparent", color: "var(--ink-soft)", border: "1px solid transparent" },
    danger:  { background: "var(--surface)", color: "var(--danger)", border: "1px solid var(--danger)" },
    accent:  { background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)" },
  };
  return (
    <button
      {...rest}
      className="atlas-focus"
      style={{
        ...variants[variant], padding: sizes[size], fontSize: fontSizes[size],
        borderRadius: 8, fontWeight: 600, display: "inline-flex", alignItems: "center",
        gap: 6, cursor: "pointer", transition: "opacity .15s, transform .1s",
        opacity: rest.disabled ? 0.5 : 1, ...rest.style,
      }}
      onMouseDown={e => { if (!rest.disabled) e.currentTarget.style.transform = "scale(.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "none"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 15} />}
      {children}
    </button>
  );
}
