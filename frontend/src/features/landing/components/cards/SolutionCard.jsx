import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const containerVariants = {
  hidden: {
    opacity: 0,
    x: -80,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.12,
      duration: 0.5,
    },
  }),
};

export default function SolutionCard({ title, items }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{
        y: -12,
        transition: {
          duration: 0.3,
        },
      }}
      viewport={{
        once: false,
        amount: 0.3,
      }}
      className="bg-glass backdrop-blur-xl border border-border rounded-3xl p-6 shadow-lg shadow-primary/10"
    >
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={22} />
        </div>

        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>

      {/* Items */}

      <div className="bg-surface/60 border border-border rounded-2xl overflow-hidden">
        {items.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            className="p-5 border-b border-border last:border-none transition-colors hover:bg-primary/5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles size={13} />
              </div>

              <div className="text-right">
                <h4 className="font-bold text-sm text-foreground mb-2">
                  {item.title}
                </h4>

                <p className="text-sm leading-6 text-muted">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
