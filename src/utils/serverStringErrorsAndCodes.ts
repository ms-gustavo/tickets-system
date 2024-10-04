export const serverStringErrorsAndCodes = {
  invalidEmailOrPassword: { message: "Email ou senha inválidos", code: 400 },
  userAlreadyExists: { message: "Usuário existente", code: 400 },
  invalidToken: { message: "Token inválido ou expirado", code: 401 },
  unauthorizedAccess: { message: "Acesso não autorizado", code: 403 },
  tokenNotProvided: { message: "Token não fornecido", code: 401 },
  eventAlreadyExists: { message: "Evento já existente", code: 400 },
  eventNotFound: { message: "Evento não encontrado", code: 404 },
  ticketAlreadyExists: { message: "Ingresso já existente", code: 400 },
  ticketNotFound: { message: "Ingresso não encontrado", code: 404 },
  invalidPriceOrAmount: { message: "Preço ou quantidade inválidos", code: 400 },
};
