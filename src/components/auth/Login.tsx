import { useEffect, useState } from "react";
import { SEO, SEO_OG_IMAGE } from "../../constants/seo";
import { applySeo } from "../../services/seo";
import { Button } from "../UI";

type LoginProps = {
  onLogin: (email: string, pass: string) => void | Promise<void>;
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applySeo({
      title: SEO.adminLogin.title,
      description: SEO.adminLogin.description,
      canonicalPath: "/admin",
      robots: "noindex, nofollow",
      ogType: "website",
      ogImage: SEO_OG_IMAGE,
      jsonLd: null,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="glass w-full max-w-md space-y-6 rounded-2xl p-8">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold">
            Connexion à l&apos;administration
          </h1>
          <p className="text-sm text-white/40">
            Connectez-vous pour gérer vos projets
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="ml-1 font-mono text-xs uppercase tracking-widest text-white/40"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-brand-orange focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="ml-1 font-mono text-xs uppercase tracking-widest text-white/40"
            >
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus:border-brand-orange focus:outline-none"
            />
          </div>
          <Button type="submit" className="w-full py-4" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </main>
  );
}
