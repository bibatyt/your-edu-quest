interface QadamLogoProps {
  size?: number;
  className?: string;
}

export function QadamLogo({ size = 36, className = "" }: QadamLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="qadamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      
      {/* Main circular path representing journey */}
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="url(#qadamGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="75 25"
        transform="rotate(-45 20 20)"
      />
      
      {/* Step marks - representing progress */}
      <circle cx="20" cy="8" r="2.5" fill="url(#qadamGradient)" />
      <circle cx="32" cy="20" r="2" fill="url(#qadamGradient)" opacity="0.7" />
      <circle cx="20" cy="32" r="1.5" fill="url(#qadamGradient)" opacity="0.5" />
      
      {/* Center Q element */}
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="url(#qadamGradient)"
        fontFamily="system-ui, sans-serif"
      >
        Q
      </text>
    </svg>
  );
}
