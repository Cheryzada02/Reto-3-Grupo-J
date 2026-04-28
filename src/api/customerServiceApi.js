const API_URL = "http://localhost:3000/api/customer-service";

export async function sendCustomerRequest(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al enviar la solicitud");
  }

  return response.json();
}