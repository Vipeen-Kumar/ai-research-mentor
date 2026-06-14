import Link from "next/link";
import { Sparkles, MessageSquare, Github } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact | AI Research Mentor",
  description: "Get in touch with the AI Research Mentor team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 mb-8">
          <MessageSquare className="w-4 h-4" />
          Get in Touch
        </div>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
          We&apos;d love to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient">
            hear from you
          </span>
        </h1>
        <p className="text-lg mx-auto leading-relaxed max-w-2xl md:text-xl text-slate-400 mb-12 font-light">
          Have a question, feature request, or just want to say hello?
          Reach out through any of the channels below.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <ContactForm />
          <ContactCard
            icon={<Github className="w-6 h-6 text-purple-400" />}
            title="GitHub"
            detail="github.com/Vipeen-Kumar/ai-research-mentor"
            description="Found a bug or want to contribute? Open an issue or pull request."
            href="https://github.com/Vipeen-Kumar/ai-research-mentor"
            linkLabel="View on GitHub"
          />
        </div>
      </section>

      {/* Back CTA */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-500 mb-6 text-sm">Or jump straight back into learning</p>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-medium transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
        >
          <Sparkles className="w-4 h-4" />
          Generate a Roadmap
        </Link>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  description,
  href,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group h-full">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-3 font-mono">{detail}</p>
      <p className="text-slate-400 leading-relaxed text-sm mb-5">{description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
      >
        {linkLabel}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
