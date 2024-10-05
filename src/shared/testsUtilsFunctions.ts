import { Request } from "express";

export function removeKeyFromBody(mockRequest: Partial<Request>, key: string) {
  const newBody = { ...mockRequest.body };
  delete newBody[key];
  mockRequest.body = newBody;
}
