const colors = {
  background: "#f5f3ec",
  card: "#ffffff",
  border: "#dedad0",
  primary: "#c46a42",
  foreground: "#1c1b19",
  muted: "#7a7870",
  accent: "#f2e6de",
  accentBlue: "#4e82b8",
};

export function BrandMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        rx="14"
        transform="rotate(45 50 50)"
        fill={colors.primary}
      />
      <rect
        x="37"
        y="37"
        width="26"
        height="26"
        rx="7"
        transform="rotate(45 50 50)"
        fill={colors.card}
      />
      <circle cx="50" cy="50" r="6" fill={colors.primary} />
    </svg>
  );
}

export function BrandIcon({ canvasSize }: { canvasSize: number }) {
  const innerSize = Math.round(canvasSize * 0.74);
  const borderWidth = Math.max(4, Math.round(canvasSize * 0.05));
  const markSize = Math.round(canvasSize * 0.46);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: innerSize,
          height: innerSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.round(canvasSize * 0.24),
          border: `${borderWidth}px solid ${colors.border}`,
          background: colors.card,
        }}
      >
        <BrandMark size={markSize} />
      </div>
    </div>
  );
}

export function BrandShareImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
        color: colors.foreground,
        padding: "56px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: "48px",
          borderRadius: "40px",
          border: `2px solid ${colors.border}`,
          background: colors.card,
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <BrandMark size={72} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: colors.primary,
            }}
          >
            Prompt Claude
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Master Claude Prompt Engineering
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            Interactive exercises, instant feedback, and a practical curriculum
            for getting better at prompting with Claude.
          </div>
        </div>
      </div>
    </div>
  );
}
