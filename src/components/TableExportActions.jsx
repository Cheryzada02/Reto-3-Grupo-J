import { Download, Mail } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import {
  downloadCsv,
  getAdminAlertsEmail,
  rowsToCsv,
  sendCsvEmail,
} from "../utils/exportEmail";

export default function TableExportActions({ columns, rows, filename, title }) {
  const { user } = useAuth();
  const { showAlert } = useAlerts();
  const [sending, setSending] = useState(false);

  const handleDownload = () => {
    downloadCsv(filename, rowsToCsv(columns, rows));
  };

  const handleEmail = async () => {
    try {
      setSending(true);
      const email = await getAdminAlertsEmail(user.user_id);

      if (!email) {
        showAlert("Configura un correo de alertas en tu perfil administrador.", "error");
        return;
      }

      await sendCsvEmail({
        to: email,
        filename,
        title,
        columns,
        rows,
      });

      showAlert("CSV enviado al correo de alertas.", "success");
    } catch (error) {
      console.error(error);
      showAlert("No se pudo enviar el CSV por correo.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="table-export-actions">
      <button type="button" className="btn" onClick={handleDownload}>
        <Download size={17} />
        Descargar CSV
      </button>

      <button type="button" className="btn" onClick={handleEmail} disabled={sending}>
        <Mail size={17} />
        {sending ? "Enviando..." : "Enviar CSV"}
      </button>
    </div>
  );
}
