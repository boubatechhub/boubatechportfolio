import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { Button } from "../UI";

const HIDDEN_PATH_PREFIXES = ["/admin"];

export function CookieBanner() {
  const location = useLocation();
  const { showBanner, accept } = useCookieConsent();

  const hiddenRoute = HIDDEN_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  );

  if (hiddenRoute || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.aside
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-desc"
        aria-live="polite"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-20 left-0 right-0 z-[90] px-4 md:bottom-6 md:left-auto md:right-6 md:max-w-lg md:px-0 lg:max-w-xl"
      >
        <div className="glass rounded-2xl border border-white/15 bg-bg-page/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-md md:p-6">
          <div className="mb-3 flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-orange/25 bg-brand-orange/10 text-brand-orange"
              aria-hidden
            >
              <Cookie size={20} />
            </span>
            <div className="min-w-0">
              <h2
                id="cookie-banner-title"
                className="font-display text-base font-medium text-white md:text-lg"
              >
                Cookies et confidentialité
              </h2>
              <p
                id="cookie-banner-desc"
                className="mt-2 text-sm leading-relaxed text-white/60"
              >
                Ce site n&apos;utilise{" "}
                <strong className="font-medium text-white/85">
                  pas de cookies publicitaires ni d&apos;analytics
                </strong>{" "}
                 Un stockage local limite
                les envois abusifs du formulaire de contact.{" "}
                .
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Link
              to="/confidentialite"
              className="order-2 text-center font-mono text-caption uppercase tracking-wider text-white/55 underline-offset-2 transition-colors hover:text-brand-orange hover:underline sm:order-1 sm:mr-auto sm:text-left"
            >
              Politique de confidentialité
            </Link>
            <Button
              type="button"
              onClick={accept}
              className="order-1 w-full !px-6 !py-3 text-sm sm:order-2 sm:w-auto"
            >
              J'ai compris
            </Button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
