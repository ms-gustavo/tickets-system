import { EmailServiceMessagesProps } from "../interfaces/interface";

export const AuthRegisterEmailNotification = ({
  name,
  newConfirmationLink,
}: EmailServiceMessagesProps) => {
  return {
    subject: "Confirmação de Cadastro",
    text: `Olá ${name},\n\nClique no link para confirmar seu cadastro: ${newConfirmationLink}\n\nObrigado!`,
  };
};
