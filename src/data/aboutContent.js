export const ABOUT_STORAGE_KEY = "ferreteria_elupina_about_content";

export const defaultAboutContent = {
  title: "Sobre Ferreteria Elupina",
  subtitle: "Herramientas, materiales y asesoria confiable para cada proyecto.",
  intro:
    "Ferreteria Elupina acompana a familias, tecnicos y constructores con productos de calidad, atencion cercana y soluciones practicas para el hogar, la obra y el mantenimiento diario.",
  sections: [
    {
      id: "historia",
      title: "Nuestra historia",
      body:
        "Nacimos con el compromiso de ofrecer una ferreteria cercana, organizada y confiable, donde cada cliente pueda encontrar orientacion clara y productos adecuados para sus necesidades.",
    },
    {
      id: "mision",
      title: "Mision",
      body:
        "Brindar productos ferreteros, herramientas y materiales de construccion con un servicio responsable, rapido y orientado a resolver.",
    },
    {
      id: "vision",
      title: "Vision",
      body:
        "Ser una ferreteria de referencia por nuestra calidad, trato humano y capacidad de apoyar proyectos pequenos y grandes con la misma dedicacion.",
    },
  ],
  values: ["Calidad", "Responsabilidad", "Servicio cercano", "Confianza"],
};

export function getAboutContent() {
  try {
    const storedContent = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (!storedContent) return defaultAboutContent;

    const parsedContent = JSON.parse(storedContent);
    return {
      ...defaultAboutContent,
      ...parsedContent,
      sections: Array.isArray(parsedContent.sections)
        ? parsedContent.sections
        : defaultAboutContent.sections,
      values: Array.isArray(parsedContent.values)
        ? parsedContent.values
        : defaultAboutContent.values,
    };
  } catch (error) {
    console.error("Error leyendo contenido de Sobre nosotros:", error);
    return defaultAboutContent;
  }
}

export function saveAboutContent(content) {
  localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(content));
}

export function resetAboutContent() {
  localStorage.removeItem(ABOUT_STORAGE_KEY);
}
