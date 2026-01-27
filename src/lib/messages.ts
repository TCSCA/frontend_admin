type MessageCode =
  | "MSG-001"
  | "MSG-002"
  | "MSG-003"
  | "MSG-004"
  | "MSG-005"
  | "MSG-006"
  | "MSG-007"
  | "MSG-008"
  | "MSG-009"
  | "MSG-010"
  | "MSG-011"
  | "MSG-012"
  | "MSG-013"
  | "MSG-014"
  | "MSG-015"
  | "MSG-016"
  | "MSG-017"
  | "MSG-018"
  | "MSG-019"
  | "MSG-020"
  | "MSG-021"
  | "MSG-022";

export class Messages {
  private static messages: Record<MessageCode, string> = {
    "MSG-001": "Plataforma no disponible. Por favor, intente más tarde.",
    "MSG-002": "Contraseña incorrecta.",
    "MSG-003": "Este usuario no tiene acceso para ingresar al Sistema",
    "MSG-004": "Campo requerido.",
    "MSG-005": "El Usuario no se encuentra registrado.",
    "MSG-006": "La longitud es menor a la mínima requerida.",
    "MSG-007": "Dato Inválido.",
    "MSG-008": "La transacción se ha realizado exitosamente",
    "MSG-009": "No se encontraron datos registrados",
    "MSG-010": "Ya existe una conexión activa con sus credenciales. ¿Desea cerrarla?",
    "MSG-011": "Sesión expirada, el sistema se cerrará",
    "MSG-012": "Tamaño Max. 5MB, con formato: .jpg, .jpeg o .png",
    "MSG-013": "No se encontraron datos registrados",
    "MSG-014": "El Usuario no se encuentra registrado.",
    "MSG-015": "Ya existe una conexión activa con sus credenciales. ¿Desea cerrarla?",
    "MSG-016": "Sesión expirada, el sistema se cerrará",
    "MSG-017": "Esta es su primera vez en el sistema. Por favor, establezca su contraseña para acceder al sistema. Utilice la misma credencial que emplea para acceder a la organización.",
    "MSG-018": "Documento de Identidad ya registrado.",
    "MSG-019": "",
    "MSG-020": "Su información ha sido actualizada de manera exitosa.",
    "MSG-021": "Valor fuera del periodo definido",
    "MSG-022": "¿Estás seguro que deseas continuar?"
  };

  static get(code: MessageCode) {
    return this.messages[code] || "Mensaje no definido";
  }
}
