// src/animations/MotionElements.jsx
import { motion } from "framer-motion";
import { forwardRef } from "react";
import { 
  fadeInUp, 
  staggerContainer, 
  staggerItem,
  slideFromRight,
  slideFromLeft,
  hoverScale 
} from "./variants";

// Headers and single elements
export const MotionDiv = forwardRef(({ 
  children, 
  delay = 0, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionDiv.displayName = "MotionDiv";

// Stagger for cards 
export const MotionStagger = forwardRef(({ 
  children, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionStagger.displayName = "MotionStagger";

// Item for stagger
export const MotionItem = forwardRef(({ 
  children, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionItem.displayName = "MotionItem";

// Slide from right
export const MotionSlideRight = forwardRef(({ 
  children, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={slideFromRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionSlideRight.displayName = "MotionSlideRight";

// Slide from left
export const MotionSlideLeft = forwardRef(({ 
  children, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={slideFromLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionSlideLeft.displayName = "MotionSlideLeft";

// Hover with size attention
export const MotionHover = forwardRef(({ 
  children, 
  className = "", 
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={hoverScale}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
});
MotionHover.displayName = "MotionHover";