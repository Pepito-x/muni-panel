export default function generateCode(rol = "") {
  const prefix = rol.toLowerCase().includes("téc") ? "TEC" : "USR";
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}
