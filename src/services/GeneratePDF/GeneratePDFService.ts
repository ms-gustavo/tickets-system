import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";
import QRCode from "qrcode";
import { TicketData } from "../../interfaces/interface";
import { format } from "date-fns";

export class GeneratePDFService {
  private static async formatPDF(
    ticketData: TicketData,
    qrCodeUrl: string,
    doc: PDFKit.PDFDocument,
    bufferStream: streamBuffers.WritableStreamBuffer
  ) {
    const formattedDate = format(new Date(ticketData.eventDate), "dd/MM/yyyy");
    doc.pipe(bufferStream);
    doc.fontSize(24).font("Helvetica-Bold").text("Ingresso para o Evento", {
      align: "center",
      underline: true,
    });
    doc.moveDown(1.5);
    doc
      .fontSize(18)
      .font("Helvetica")
      .text(`Evento: ${ticketData.eventTitle}`, {
        align: "left",
      });
    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Nome:", { continued: true })
      .font("Helvetica")
      .text(` ${ticketData.userName}`);
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .text("Tipo de Ingresso:", { continued: true })
      .font("Helvetica")
      .text(` ${ticketData.ticketType}`);
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .text("Preço:", { continued: true })
      .font("Helvetica")
      .text(` R$ ${ticketData.ticketPrice.toFixed(2)}`);
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .text("Data do Evento:", { continued: true })
      .font("Helvetica")
      .text(` ${formattedDate}`);
    doc.moveDown(0.2);
    doc
      .font("Helvetica-Bold")
      .text("Local:", { continued: true })
      .font("Helvetica")
      .text(` ${ticketData.eventLocation}`);
    doc.moveDown(1);
    doc.lineWidth(1).moveTo(30, doc.y).lineTo(580, doc.y).stroke();
    doc.moveDown(1);
    doc.fontSize(12).text("Apresente este QR Code na entrada do evento.", {
      align: "center",
    });
    doc.moveDown(1);
    doc.image(qrCodeUrl, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });
    doc.end();
  }

  static async generateTicketPDF(ticketData: TicketData) {
    const doc = new PDFDocument();
    const bufferStream = new streamBuffers.WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024,
    });
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

    await this.formatPDF(ticketData, qrCodeUrl, doc, bufferStream);

    return new Promise<Buffer>((resolve, reject) => {
      bufferStream.on("finish", () => {
        resolve(bufferStream.getContents() as Buffer);
      });
      bufferStream.on("error", reject);
    });
  }
}
