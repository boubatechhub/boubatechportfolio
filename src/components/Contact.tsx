import { useState } from "react";
import { motion } from "motion/react";
import { Github, Globe, Linkedin, Mail, MapPin, Phone, User } from "lucide-react";
import { CONTACT_DETAILS, CONTACT_SOCIALS } from "../constants";
import { handleDatabaseError, OperationType } from "../services/errorHandling";
import { isSupabaseConfigured } from "../services/supabase";
import { insertRow } from "../services/supabaseDb";
import type { Settings } from "../types";
import { getProfileImageSrc } from "../utils";
import { Button, Modal, Section } from "./UI";
import { ClipReveal, MaskReveal, Stagger, StaggerItem } from "./Reveal";

const SOCIAL_ICONS = {
  GitHub: Github,
  LinkedIn: Linkedin,
  "Site web": Globe,
} as const;

type ContactDetailItem = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
};

const CONTACT_ITEMS: ContactDetailItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_DETAILS.email,
    href: `mailto:${CONTACT_DETAILS.email}`,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: CONTACT_DETAILS.phone,
    href: `tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: CONTACT_DETAILS.location,
  },
];

export function Contact({ settings }: { settings: Settings }) {
  const profileSrc = getProfileImageSrc(settings.profileImageUrl);
  const profileAlt = `Photo de profil — ${settings.name?.trim() || CONTACT_DETAILS.fullName}`;

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const path = "messages";

    if (formData.website.trim().length > 0) {
      setLoading(false);
      return;
    }
    const now = Date.now();
    const lastSubmit = Number(
      localStorage.getItem("contact_last_submit_ts") || "0",
    );
    if (now - lastSubmit < 30_000) {
      setLoading(false);
      alert(
        "Merci. Veuillez patienter quelques secondes avant de renvoyer un message.",
      );
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      alert("Supabase n'est pas configuré : impossible d'envoyer le message.");
      return;
    }

    const payload = {
      name: formData.name.trim().slice(0, 80),
      email: formData.email.trim().slice(0, 120),
      message: formData.message.trim().slice(0, 2000),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setLoading(false);
      alert("Merci de compléter tous les champs.");
      return;
    }

    try {
      await insertRow("messages", {
        ...payload,
        createdAt: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem("contact_last_submit_ts", String(Date.now()));
      setSuccess(true);
      setFormData({ name: "", email: "", message: "", website: "" });
      setTimeout(() => {
        setSuccess(false);
        setFormOpen(false);
      }, 2500);
    } catch (error) {
      await handleDatabaseError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="contact"
      subtitle="Contact"
      title={
        <>
          Construisons quelque chose{" "}
          <span className="font-serif-accent text-brand-orange">ensemble.</span>
        </>
      }
    >
      <div className="flex w-full flex-col items-stretch gap-10 sm:gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-20 2xl:gap-24">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 sm:gap-8 lg:max-w-none xl:max-w-[52rem]">
          <MaskReveal>
          <a
            href={`mailto:${CONTACT_DETAILS.email}`}
            className="group inline-flex max-w-full items-center gap-3 break-all font-display text-2xl font-medium tracking-[-0.03em] text-white underline decoration-white/15 decoration-1 underline-offset-[10px] transition-colors hover:text-brand-orange hover:decoration-brand-orange md:text-4xl"
          >
            {CONTACT_DETAILS.email}
          </a>
          </MaskReveal>
          <div className="portfolio-card rounded-[1.5rem] border p-6 md:p-8">
            <h3 className="mb-1 font-display text-xl font-medium text-white md:text-2xl">
              Mes coordonnées
            </h3>
            <p className="mb-6 text-sm text-white/50">
              {CONTACT_DETAILS.fullName} — {CONTACT_DETAILS.role}
            </p>

            <Stagger as="ul" gap={0.09} className="mb-8 space-y-4">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <StaggerItem as="li" key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="group flex items-start gap-4 text-left transition-colors hover:text-brand-orange"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#f3efe8] transition-colors group-hover:border-brand-orange/30 group-hover:bg-brand-orange/10 ">
                        <Icon
                          className="h-[18px] w-[18px] text-brand-orange"
                          aria-hidden
                        />
                      </span>
                      <span>
                        <span className="block font-mono text-caption uppercase tracking-widest text-white/40">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-sm text-white/85 md:text-base">
                          {value}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#f3efe8] ">
                        <Icon
                          className="h-[18px] w-[18px] text-brand-orange"
                          aria-hidden
                        />
                      </span>
                      <span>
                        <span className="block font-mono text-caption uppercase tracking-widest text-white/40">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-sm text-white/85 md:text-base">
                          {value}
                        </span>
                      </span>
                    </div>
                  )}
                </StaggerItem>
              ))}
            </Stagger>

            <nav
              className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3"
              aria-label="Réseaux sociaux"
            >
              {CONTACT_SOCIALS.map(({ label, href, handle }) => {
                const Icon = SOCIAL_ICONS[label as keyof typeof SOCIAL_ICONS];
                return (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} — ${handle}`}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-4 text-white/70 transition-colors hover:text-brand-orange"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#f3efe8] transition-colors group-hover:border-brand-orange/30 group-hover:bg-brand-orange/10 ">
                      <Icon
                        className="h-[18px] w-[18px]"
                        aria-hidden
                      />
                    </span>
                    <span>
                      <span className="block font-mono text-caption uppercase tracking-widest text-white/40">
                        {label}
                      </span>
                      <span className="text-sm">{handle}</span>
                    </span>
                  </motion.a>
                );
              })}
            </nav>
          </div>

          <Button
            type="button"
            className="w-full py-4 sm:w-auto sm:px-12"
            onClick={() => setFormOpen(true)}
          >
            Envoyer un message
          </Button>
        </div>

        <div className="flex w-full flex-1 items-center justify-center lg:sticky lg:top-28 lg:self-start xl:top-32">
          <ClipReveal className="w-full max-w-[min(100%,280px)] sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[420px] 2xl:max-w-[480px]" delay={0.15}>
          <div className="portfolio-card relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[420px] 2xl:max-w-[480px]">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={profileAlt}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                width={480}
                height={600}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center bg-white/[0.03] text-white/20"
                aria-hidden
              >
                <User className="h-24 w-24 sm:h-28 sm:w-28" />
              </div>
            )}
          </div>
          </ClipReveal>
        </div>
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
        <div className="glass mx-auto max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 p-6 sm:max-w-xl md:p-10 xl:max-w-2xl">
          <h3 className="mb-2 font-display text-2xl font-medium text-white md:text-3xl">
            Envoyer un message
          </h3>
          <p className="mb-8 text-sm text-white/50">
            Décrivez votre projet ou votre opportunité.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="ml-1 font-mono text-xs uppercase tracking-widest text-white/40"
              >
                Nom
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition-colors focus:border-brand-orange focus:outline-none"
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="ml-1 font-mono text-xs uppercase tracking-widest text-white/40"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition-colors focus:border-brand-orange focus:outline-none"
                placeholder="saisissez votre email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="ml-1 font-mono text-xs uppercase tracking-widest text-white/40"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                autoComplete="off"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition-colors focus:border-brand-orange focus:outline-none"
                placeholder="Votre message..."
              />
            </div>
            <Button type="submit" className="w-full py-5" disabled={loading}>
              {loading
                ? "Envoi en cours..."
                : success
                  ? "Message envoyé !"
                  : "Envoyer le message"}
            </Button>
            {success && (
              <p className="animate-bounce text-center text-sm font-medium text-brand-orange">
                Merci ! Votre message a été envoyé avec succès.
              </p>
            )}
          </form>
        </div>
      </Modal>
    </Section>
  );
}
