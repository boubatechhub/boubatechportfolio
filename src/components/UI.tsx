import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PAGE_CONTAINER_CLASS, SECTION_PY_CLASS } from "../layout";

interface SectionProps {
  id: string;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
  /** Centre le sous-titre et le titre de la section */
  centerHeader?: boolean;
}

export const Section = ({
  id,
  title,
  subtitle,
  children,
  className = "",
  dark = false,
  centerHeader = false,
}: SectionProps) => {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.section
      id={id}
      data-surface={id}
      className={`portfolio-section ${SECTION_PY_CLASS} ${dark ? "bg-black/40" : "bg-transparent"} ${className}`}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, transform: "translateY(14px)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: reduceMotion ? 0.18 : 0.6,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <div className={PAGE_CONTAINER_CLASS}>
        {(title || subtitle) && (
          <header
            className={`mb-10 md:mb-12 xl:mb-14 2xl:mb-16 ${centerHeader ? "text-center" : "text-left"}`}
          >
            {subtitle && (
              <p className="mb-2 block font-mono text-xs uppercase tracking-widest text-brand-orange">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl xl:text-display-md 2xl:text-6xl">
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </motion.section>
  );
};

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  const variants = {
    primary:
      "bg-brand-orange text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "border border-white/35 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <motion.button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`site-button flex items-center justify-center gap-2 rounded-full px-8 py-4 font-medium transition-colors duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const Badge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  key?: string | number;
}) => (
  <span
    className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-caption uppercase tracking-wider text-white/70 ${className}`}
  >
    {children}
  </span>
);

/** Modal centré pour formulaires admin (corps scrollable). */
export const FormModal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="admin-form-modal flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-neutral-200 bg-[#fffdf9] text-neutral-950 shadow-2xl sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl md:max-w-3xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-6">
              <h2
                id="form-modal-title"
                className="font-display text-lg font-medium sm:text-xl"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="site-button flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full glass text-white transition-all hover:bg-white/10 hover:text-brand-orange md:top-8 md:right-8 md:h-12 md:w-12"
          >
            <X size={20} className="md:h-6 md:w-6" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto w-full max-h-[90vh] max-w-6xl overflow-hidden rounded-3xl shadow-2xl shadow-brand-orange/10 xl:max-w-7xl 2xl:max-w-[90rem]"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`fixed bottom-8 left-1/2 z-[10001] px-6 py-3 rounded-full glass border ${type === "success" ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"} flex items-center gap-3 shadow-2xl shadow-black`}
        >
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
