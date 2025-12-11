import { motion } from "framer-motion";

interface QadamLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function QadamLogo({ size = 36, className = "", animated = false }: QadamLogoProps) {
  const LogoContent = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect 
        x="4" 
        y="4" 
        width="32" 
        height="32" 
        rx="10" 
        className="fill-primary"
      />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        className="fill-primary-foreground"
        style={{
          fontSize: '24px',
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        Q
      </text>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
}
