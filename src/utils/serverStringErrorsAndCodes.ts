export const serverStringErrorsAndCodes = {
  invalidEmailOrPassword: { message: "Email ou senha inválidos", code: 400 },
  userAlreadyExists: { message: "Usuário existente", code: 400 },
  invalidToken: { message: "Token inválido ou expirado", code: 401 },
  unauthorizedAccess: { message: "Acesso não autorizado", code: 403 },
  tokenNotProvided: { message: "Token não fornecido", code: 401 },
};
