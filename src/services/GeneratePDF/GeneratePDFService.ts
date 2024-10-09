import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";
import QRCode from "qrcode";
import { TicketData } from "../../interfaces/interface";

export class GeneratePDFService {
  static async generateTicketPDF(ticketData: TicketData) {
    const doc = new PDFDocument();
    const bufferStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });

    doc.pipe(bufferStream);
    doc.fontSize(20).text(`Ticket para o evento: ${ticketData.eventTitle}`, {
      align: "center",
    });
    doc.moveDown();
    doc.fontSize(14).text(`Nome: ${ticketData.userName}`);
    doc.text(`Tipo de Ingresso: ${ticketData.ticketType}`);
    doc.text(`Preço: R$ ${ticketData.ticketPrice}`);
    doc.text(`Data do evento: ${ticketData.eventDate}`);
    doc.text(`Local: ${ticketData.eventLocation}`);

    const qrCodeData = {
      id: ticketData.ticketId,
      userName: ticketData.userName,
      eventTitle: ticketData.eventTitle,
      ticketType: ticketData.ticketType,
      price: ticketData.ticketPrice,
      eventDate: ticketData.eventDate,
      eventLocation: ticketData.eventLocation,
    };

    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrCodeData));
    doc.image(qrCodeUrl, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });
    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      bufferStream.on("finish", () => {
        resolve(bufferStream.getContents() as Buffer);
      });
      bufferStream.on("error", reject);
    });
  }
}
