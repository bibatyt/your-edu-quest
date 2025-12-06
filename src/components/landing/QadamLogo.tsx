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
        <linearGradient id="qadamGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="20" cy="20" r="18" fill="url(#qadamGreen)" />
      
      {/* Letter Q */}
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        Q
      </text>
      
      {/* Small step accent */}
      <circle cx="30" cy="28" r="3" fill="white" opacity="0.3" />
    </svg>
  );
}
