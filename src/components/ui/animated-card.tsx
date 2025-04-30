import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard = ({
  children,
  className,
  whileHover = {
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    translateY: -5
  },
  whileTap = { scale: 0.98 },
  ...props
}: AnimatedCardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-200",
        className
      )}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { AnimatedCard };