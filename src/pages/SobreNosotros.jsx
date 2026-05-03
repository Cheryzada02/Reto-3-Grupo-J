import { useEffect, useState } from "react";
import { CheckCircle, Hammer, ShieldCheck, Store } from "lucide-react";

import { getAboutContent } from "../data/aboutContent";

export default function SobreNosotros() {
  const [content, setContent] = useState(() => getAboutContent());

  useEffect(() => {
    const refreshContent = () => setContent(getAboutContent());

    window.addEventListener("storage", refreshContent);
    window.addEventListener("about-content-updated", refreshContent);

    return () => {
      window.removeEventListener("storage", refreshContent);
      window.removeEventListener("about-content-updated", refreshContent);
    };
  }, []);

  return (
    <main className="page-shell about-page">
      <section className="page-hero about-hero">
        <div>
          <span>Conocenos</span>
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </div>
      </section>

      <section className="about-intro">
        <div className="about-intro-icon">
          <Store size={34} />
        </div>
        <p>{content.intro}</p>
      </section>

      <section className="about-sections">
        {content.sections.map((section, index) => {
          const Icon = index === 0 ? Hammer : ShieldCheck;

          return (
            <article className="surface-card about-card" key={section.id}>
              <span>
                <Icon size={24} />
              </span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          );
        })}
      </section>

      <section className="surface-card about-values">
        <div>
          <span>Valores</span>
          <h2>Lo que guia nuestro servicio</h2>
        </div>

        <div className="about-values-list">
          {content.values.map((value) => (
            <span key={value}>
              <CheckCircle size={18} />
              {value}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
