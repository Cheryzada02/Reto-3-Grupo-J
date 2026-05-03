import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, Info, X, XCircle } from "lucide-react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback(
    (message, type = "info") => {
      const id = crypto.randomUUID();

      setAlerts((current) => [...current, { id, message, type }]);

      window.setTimeout(() => {
        removeAlert(id);
      }, 4200);
    },
    [removeAlert]
  );

  return (
    <AlertContext.Provider value={{ showAlert, removeAlert }}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {alerts.map((alert) => {
          const Icon = alert.type === "error" ? XCircle : alert.type === "success" ? CheckCircle : Info;

          return (
            <div className={`toast-message ${alert.type}`} key={alert.id}>
              <Icon size={20} />
              <span>{alert.message}</span>
              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                aria-label="Cerrar notificación"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlerts must be used inside AlertProvider");
  }

  return context;
}
