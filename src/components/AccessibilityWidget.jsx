import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Eye,
  Link as LinkIcon,
  Moon,
  MousePointer2,
  RotateCcw,
  SkipForward,
  Type,
  Waves,
  X,
} from "lucide-react";

const STORAGE_KEY = "elupina-accessibility-settings";

const defaultSettings = {
  largeText: false,
  highContrast: false,
  colorBlind: false,
  reduceMotion: false,
  underlineLinks: false,
  readableText: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaultSettings, ...savedSettings };
    } catch {
      return defaultSettings;
    }
  });

  const options = useMemo(
    () => [
      {
        key: "largeText",
        title: "Texto grande",
        text: "Aumenta el tamaño de lectura.",
        icon: Type,
      },
      {
        key: "highContrast",
        title: "Alto contraste",
        text: "Mejora lectura para baja visión.",
        icon: Moon,
      },
      {
        key: "colorBlind",
        title: "Modo daltónico",
        text: "Usa colores más distinguibles.",
        icon: Eye,
      },
      {
        key: "reduceMotion",
        title: "Reducir movimiento",
        text: "Quita animaciones y transiciones.",
        icon: Waves,
      },
      {
        key: "underlineLinks",
        title: "Subrayar enlaces",
        text: "Hace los enlaces más claros.",
        icon: LinkIcon,
      },
      {
        key: "readableText",
        title: "Lectura cómoda",
        text: "Aumenta espaciado y enfoque.",
        icon: MousePointer2,
      },
    ],
    []
  );

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(settings).forEach(([key, value]) => {
      root.classList.toggle(`a11y-${key}`, value);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, []);

  const toggleOption = (key) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: !currentSettings[key],
    }));
  };

  const resetOptions = () => {
    setSettings(defaultSettings);
  };

  const focusMainContent = () => {
    const mainContent = document.querySelector("main");

    if (!mainContent) return;

    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus({ preventScroll: false });
    setIsOpen(false);
  };

  return (
    <div className="accessibility-widget">
      {isOpen && (
        <section
          className="accessibility-panel"
          aria-label="Opciones de accesibilidad"
        >
          <header className="accessibility-header">
            <div>
              <span>Accesibilidad</span>
              <h2>Ajustes visuales</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar opciones de accesibilidad"
            >
              <X size={20} />
            </button>
          </header>

          <div className="accessibility-options">
            <button
              type="button"
              className="accessibility-option"
              onClick={focusMainContent}
            >
              <SkipForward size={20} />

              <span>
                <strong>Ir al contenido</strong>
                <small>Salta menús y va directo a la página.</small>
              </span>
            </button>

            {options.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  type="button"
                  className={
                    settings[option.key]
                      ? "accessibility-option active"
                      : "accessibility-option"
                  }
                  key={option.key}
                  onClick={() => toggleOption(option.key)}
                  aria-pressed={settings[option.key]}
                >
                  <Icon size={20} />

                  <span>
                    <strong>{option.title}</strong>
                    <small>{option.text}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="accessibility-reset"
            onClick={resetOptions}
          >
            <RotateCcw size={17} />
            Restablecer ajustes
          </button>
        </section>
      )}

      <button
        type="button"
        className="accessibility-toggle"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={isOpen}
      >
        <Accessibility size={28} />
      </button>
    </div>
  );
}
