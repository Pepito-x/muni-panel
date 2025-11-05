// Servicio para enviar correos usando tu servidor desplegado en Render
export async function enviarCodigo({ correo, codigo, rol }) {
  try {
    const response = await fetch("https://muni-panel-server.onrender.com/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, codigo, rol }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return { success: false, error: error.message };
  }
}
