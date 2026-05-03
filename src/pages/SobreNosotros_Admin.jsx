import { useEffect, useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import {
  defaultAboutContent,
  getAboutContent,
  resetAboutContent,
  saveAboutContent,
} from "../data/aboutContent";
import { useAlerts } from "../context/AlertContext";

const createSection = () => ({
  id: crypto.randomUUID(),
  title: "Nueva seccion",
  body: "Escribe aqui el contenido de esta seccion.",
});

export default function SobreNosotrosAdmin() {
  const [content, setContent] = useState(() => getAboutContent());
  const { showAlert } = useAlerts();

  useEffect(() => {
    setContent(getAboutContent());
  }, []);

  const updateField = (field, value) => {
    setContent((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSection = (sectionId, field, value) => {
    setContent((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addSection = () => {
    setContent((current) => ({
      ...current,
      sections: [...current.sections, createSection()],
    }));
  };

  const removeSection = (sectionId) => {
    setContent((current) => ({
      ...current,
      sections: current.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const addValue = () => {
    setContent((current) => ({
      ...current,
      values: [...current.values, "Nuevo valor"],
    }));
  };

  const updateValue = (index, value) => {
    setContent((current) => ({
      ...current,
      values: current.values.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const removeValue = (index) => {
    setContent((current) => ({
      ...current,
      values: current.values.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    const cleanContent = {
      ...content,
      title: content.title.trim() || defaultAboutContent.title,
      subtitle: content.subtitle.trim() || defaultAboutContent.subtitle,
      intro: content.intro.trim() || defaultAboutContent.intro,
      sections: content.sections
        .filter((section) => section.title.trim() || section.body.trim())
        .map((section) => ({
          ...section,
          title: section.title.trim() || "Seccion",
          body: section.body.trim(),
        })),
      values: content.values
        .map((value) => value.trim())
        .filter(Boolean),
    };

    saveAboutContent(cleanContent);
    setContent(cleanContent);
    window.dispatchEvent(new Event("about-content-updated"));
    showAlert("Contenido de Sobre nosotros guardado.", "success");
  };

  const handleReset = () => {
    resetAboutContent();
    setContent(defaultAboutContent);
    window.dispatchEvent(new Event("about-content-updated"));
    showAlert("Contenido restaurado.", "info");
  };

  return (
    <main className="page-shell about-admin-page">
      <section className="page-hero page-header-admin">
        <div>
          <span>Contenido publico</span>
          <h1>Sobre nosotros</h1>
          <p>Edita lo que vera el cliente en la pagina Sobre nosotros.</p>
        </div>

        <div className="about-admin-actions">
          <button type="button" className="btn" onClick={handleReset}>
            <RotateCcw size={17} />
            Restaurar
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            <Save size={17} />
            Guardar cambios
          </button>
        </div>
      </section>

      <section className="surface-card about-admin-form">
        <label>
          Titulo
          <input
            value={content.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>

        <label>
          Subtitulo
          <input
            value={content.subtitle}
            onChange={(event) => updateField("subtitle", event.target.value)}
          />
        </label>

        <label>
          Introduccion
          <textarea
            value={content.intro}
            onChange={(event) => updateField("intro", event.target.value)}
          />
        </label>
      </section>

      <section className="about-admin-section">
        <div className="about-admin-section-header">
          <div>
            <span>Bloques</span>
            <h2>Secciones de contenido</h2>
          </div>
          <button type="button" className="btn" onClick={addSection}>
            <Plus size={17} />
            Agregar seccion
          </button>
        </div>

        <div className="about-admin-list">
          {content.sections.map((section) => (
            <article className="surface-card about-admin-card" key={section.id}>
              <div className="about-admin-card-header">
                <strong>{section.title || "Seccion sin titulo"}</strong>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  aria-label="Eliminar seccion"
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <label>
                Titulo
                <input
                  value={section.title}
                  onChange={(event) =>
                    updateSection(section.id, "title", event.target.value)
                  }
                />
              </label>

              <label>
                Texto
                <textarea
                  value={section.body}
                  onChange={(event) =>
                    updateSection(section.id, "body", event.target.value)
                  }
                />
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card about-admin-values">
        <div className="about-admin-section-header">
          <div>
            <span>Valores</span>
            <h2>Lista de valores</h2>
          </div>
          <button type="button" className="btn" onClick={addValue}>
            <Plus size={17} />
            Agregar valor
          </button>
        </div>

        <div className="about-admin-values-list">
          {content.values.map((value, index) => (
            <div className="about-admin-value-row" key={`${value}-${index}`}>
              <input
                value={value}
                onChange={(event) => updateValue(index, event.target.value)}
              />
              <button
                type="button"
                onClick={() => removeValue(index)}
                aria-label="Eliminar valor"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
