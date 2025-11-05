const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.enviarCodigo = functions.firestore
  .document("usuarios_pendientes/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const correo = data.correo;
    const codigo = data.codigo;
    const rol = data.rol || "empleado";

    const msg = {
      to: correo,
      from: "informatica@reque.gob.pe", // debe ser verificado en SendGrid
      subject: "Código de acceso - Municipalidad de Reque",
      text: `
Hola,

Te damos la bienvenida al sistema de incidencias internas de la Municipalidad de Reque.

Tu código de registro es: ${codigo}

Rol asignado: ${rol.toUpperCase()}

Por favor, abre la app e ingresa tu correo y este código para completar tu registro.

Atentamente,
Oficina de Informática - Municipalidad Distrital de Reque.
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Correo enviado a ${correo}`);
    } catch (error) {
      console.error("❌ Error al enviar correo:", error);
    }
  });
