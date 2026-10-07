import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LegalPageLayout,
  LegalSection,
} from "../components/layout/LegalPageLayout";
import { CONTACT_DETAILS } from "../constants";
import { SEO, SEO_OG_IMAGE } from "../constants/seo";
import { applySeo } from "../services/seo";

const LAST_UPDATED = "19 mai 2026";

const siteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  "https://boubacartraore.fr";

export function PrivacyPolicyPage() {
  useEffect(() => {
    applySeo({
      title: SEO.privacy.title,
      description: SEO.privacy.description,
      canonicalPath: "/confidentialite",
      robots: "index, follow",
      ogType: "website",
      ogImage: SEO_OG_IMAGE,
      jsonLd: null,
    });
  }, []);

  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      lastUpdated={LAST_UPDATED}
    >
      <LegalSection title="1. Objet">
        <p>
          La présente politique décrit comment{" "}
          <strong className="font-medium text-white/90">
            {CONTACT_DETAILS.fullName}
          </strong>{" "}
          (« nous », « le responsable ») traite les données personnelles
          collectées via le site portfolio accessible à l&apos;adresse{" "}
          <a
            href={siteUrl}
            className="text-brand-orange underline-offset-2 hover:underline"
            rel="noopener noreferrer"
          >
            {siteUrl.replace(/^https?:\/\//, "")}
          </a>
          .
        </p>
        <p>
          En utilisant ce site ou en nous contactant via le formulaire, vous
          acceptez les pratiques décrites ci-dessous, dans le respect du
          Règlement général sur la protection des données (RGPD) et de la loi
          Informatique et Libertés.
        </p>
      </LegalSection>

      <LegalSection title="2. Responsable du traitement">
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>
            <span className="text-white/55">Identité :</span>{" "}
            {CONTACT_DETAILS.fullName}
          </li>
          <li>
            <span className="text-white/55">Activité :</span>{" "}
            {CONTACT_DETAILS.role}
          </li>
          <li>
            <span className="text-white/55">Localisation :</span>{" "}
            {CONTACT_DETAILS.location}
          </li>
          <li>
            <span className="text-white/55">Contact :</span>{" "}
            <a
              href={`mailto:${CONTACT_DETAILS.email}`}
              className="text-brand-orange underline-offset-2 hover:underline"
            >
              {CONTACT_DETAILS.email}
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Utilisation de Supabase">
        <p>
          Le portfolio s&apos;appuie sur{" "}
          <a
            href="https://supabase.com"
            className="text-brand-orange underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Supabase
          </a>{" "}
          comme prestataire technique (sous-traitant au sens du RGPD) pour :
        </p>
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>
            <strong className="font-medium text-white/85">
              Afficher le contenu public
            </strong>{" "}
            : projets, compétences, expériences, créations et paramètres du site
            (lecture anonyme via l&apos;API Supabase).
          </li>
          <li>
            <strong className="font-medium text-white/85">
              Recevoir les messages de contact
            </strong>{" "}
            : lorsque vous soumettez le formulaire, nom, e-mail et message sont
            enregistrés dans une table dédiée.
          </li>
          <li>
            <strong className="font-medium text-white/85">
              Administration
            </strong>{" "}
            : connexion sécurisée réservée au gestionnaire du site (espace{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-caption text-white/80">
              /admin
            </code>
            ), sans accès public aux messages ou aux données d&apos;édition.
          </li>
        </ul>
        <p>
          Les données transitent par chiffrement HTTPS. Les serveurs peuvent
          être situés dans l&apos;Union européenne ou hors UE ; Supabase
          applique alors des garanties contractuelles (clauses types, etc.)
          selon sa{" "}
          <a
            href="https://supabase.com/privacy"
            className="text-brand-orange underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Formulaire de contact">
        <p>
          La section{" "}
          <Link
            to="/#contact"
            className="text-brand-orange underline-offset-2 hover:underline"
          >
            Contact
          </Link>{" "}
          propose un formulaire facultatif. Les champs collectés sont :
        </p>
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>nom (obligatoire) ;</li>
          <li>adresse e-mail (obligatoire) ;</li>
          <li>contenu du message (obligatoire).</li>
        </ul>
        <p>
          Un champ « site web » invisible (honeypot) permet de filtrer une
          partie des envois automatisés ; il n&apos;est pas enregistré. Les
          données envoyées sont stockées dans Supabase et consultables
          uniquement par le responsable du site via l&apos;interface
          d&apos;administration.
        </p>
        <p>
          <strong className="font-medium text-white/85">Finalité :</strong>{" "}
          répondre à votre demande (candidature, collaboration, question).
          <br />
          <strong className="font-medium text-white/85">
            Base légale :
          </strong>{" "}
          intérêt légitime et/ou mesures précontractuelles selon le contexte de
          votre message.
        </p>
      </LegalSection>

      <LegalSection title="5. Analytics et mesure d'audience">
        <p>
          <strong className="font-medium text-white/85">
            Aucun outil d&apos;analytics ou de suivi d&apos;audience n&apos;est
            installé
          </strong>{" "}
          sur ce site : pas de Google Analytics, Matomo, Plausible, Meta Pixel,
          Hotjar, ni autre solution de mesure comportementale ou publicitaire.
        </p>
        <p>
          Nous ne créons pas de profil utilisateur à des fins marketing et ne
          revendons pas vos données. La consultation des pages du portfolio ne
          génère pas de cookie de tracking tiers de notre part.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies et stockage local">
        <p>
          <strong className="font-medium text-white/85">
            Cookies publicitaires ou de mesure d&apos;audience :
          </strong>{" "}
          aucun.
        </p>
        <p>
          <strong className="font-medium text-white/85">
            Stockage local du navigateur (localStorage) :
          </strong>{" "}
          une clé technique enregistre uniquement l&apos;horodatage de votre
          dernier envoi du formulaire de contact, afin d&apos;espacer les
          soumissions (anti-spam). Aucune donnée personnelle identifiable
          n&apos;y est stockée.
        </p>
        <p>
          <strong className="font-medium text-white/85">
            Préférence bannière cookies :
          </strong>{" "}
          lorsque vous cliquez sur « J&apos;ai compris », nous mémorisons votre
          choix en localStorage pour ne plus afficher la bannière (tant que la
          version de la politique ne change pas).
        </p>
        <p>
          <strong className="font-medium text-white/85">
            Session d&apos;administration :
          </strong>{" "}
          si vous vous connectez à l&apos;espace admin, Supabase Auth peut
          utiliser des cookies ou stockages techniques strictement nécessaires à
          l&apos;authentification (hors parcours visiteur classique).
        </p>
        <p>
          Vous pouvez effacer le stockage local à tout moment via les paramètres
          de votre navigateur.
        </p>
      </LegalSection>

      <LegalSection title="7. Finalités et bases légales (récapitulatif)">
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>
            Répondre aux messages de contact — intérêt légitime / mesures
            précontractuelles.
          </li>
          <li>Afficher et maintenir le portfolio — intérêt légitime.</li>
          <li>Sécuriser le site et limiter les abus — intérêt légitime.</li>
          <li>Gérer le contenu (admin) — intérêt légitime, accès restreint.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Durée de conservation">
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>
            Messages de contact : le temps nécessaire au traitement, puis
            suppression au plus tard{" "}
            <strong className="font-medium text-white/85">3 ans</strong> après
            le dernier échange.
          </li>
          <li>
            Compte administrateur : durée d&apos;utilisation du compte, selon
            Supabase Auth.
          </li>
          <li>
            Préférence bannière cookies : jusqu&apos;à mise à jour de la
            politique ou effacement manuel du stockage local.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Destinataires">
        <p>
          Vos données ne sont pas vendues. Seuls le responsable du traitement et
          les prestataires techniques nécessaires (Supabase, hébergeur du site
          front-end) y ont accès, dans la stricte limite de leurs missions.
        </p>
      </LegalSection>

      <LegalSection title="10. Vos droits">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-inside list-disc space-y-2 text-white/70">
          <li>accès à vos données ;</li>
          <li>rectification des données inexactes ;</li>
          <li>
            effacement (« droit à l&apos;oubli ») dans les limites prévues par
            la loi ;
          </li>
          <li>limitation ou opposition au traitement ;</li>
          <li>portabilité, lorsque applicable ;</li>
          <li>
            retrait de votre consentement, lorsque le traitement en est fondé.
          </li>
        </ul>
        <p>
          Pour exercer ces droits :{" "}
          <a
            href={`mailto:${CONTACT_DETAILS.email}`}
            className="text-brand-orange underline-offset-2 hover:underline"
          >
            {CONTACT_DETAILS.email}
          </a>
          . Réponse sous un mois maximum.
        </p>
        <p>
          Réclamation possible auprès de la{" "}
          <a
            href="https://www.cnil.fr"
            className="text-brand-orange underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            CNIL
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="11. Sécurité">
        <p>
          Mesures en place : HTTPS, authentification admin, politiques RLS
          Supabase, validation des fichiers uploadés, limitation des envois du
          formulaire. Aucune sécurité absolue sur Internet n&apos;est garantie.
        </p>
      </LegalSection>

      <LegalSection title="12. Mineurs">
        <p>
          Ce site ne s&apos;adresse pas aux personnes de moins de 16 ans. Nous
          ne collectons pas sciemment de données concernant des mineurs.
        </p>
      </LegalSection>

      <LegalSection title="13. Modifications">
        <p>
          Cette politique peut être mise à jour. La date en tête de page indique
          la dernière révision. Un changement important peut réafficher la
          bannière d&apos;information cookies.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>
          Questions sur cette politique ou vos données :{" "}
          <a
            href={`mailto:${CONTACT_DETAILS.email}`}
            className="text-brand-orange underline-offset-2 hover:underline"
          >
            {CONTACT_DETAILS.email}
          </a>{" "}
          ou le{" "}
          <Link
            to="/#contact"
            className="text-brand-orange underline-offset-2 hover:underline"
          >
            formulaire de contact
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
