import React from "react";
import { Palette } from "../../styles/palette";

export default function OverlayModal({
  isOpen,
  onClose,
  children,
  width = "min(900px, 96vw)",
  maxHeight = "90vh",
  zIndex = 9999,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex,
        padding: "16px",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width,
          maxHeight,
          overflowY: "auto",
          background: Palette.surface,
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
