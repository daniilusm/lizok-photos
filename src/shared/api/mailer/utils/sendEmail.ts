import { createTransporter } from "./createTransporter";
import type { ContactFormValues } from "../schema";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export async function sendEmail(data: ContactFormValues): Promise<void> {
  if (!process.env.SMTP_CONTACT_FORM_EMAIL) {
    throw new Error("process.env.SMTP_CONTACT_FORM_EMAIL required");
  }

  const recipientEmail = process.env.SMTP_CONTACT_FORM_EMAIL;
  const senderEmail = process.env.SMTP_USER || recipientEmail;
  const transporter = createTransporter();

  const comment = data.comment?.trim() || "—";

  const htmlContent = `
    <h2>Новая заявка с сайта Lizok Photos</h2>
    <p><strong>Имя:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Дата съёмки:</strong> ${escapeHtml(data.shootDate)}</p>
    <p><strong>Телефон:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Комментарий:</strong></p>
    <p>${escapeHtml(comment).replaceAll("\n", "<br/>")}</p>
  `;

  const textContent = [
    "Новая заявка с сайта Lizok Photos",
    `Имя: ${data.name}`,
    `Дата съёмки: ${data.shootDate}`,
    `Телефон: ${data.phone}`,
    `Комментарий: ${comment}`,
  ].join("\n");

  await transporter.sendMail({
    from: `"Форма обратной связи" <${senderEmail}>`,
    to: recipientEmail,
    subject: `Заявка с сайта: ${data.name}`,
    html: htmlContent,
    text: textContent,
    replyTo: undefined,
  });
}
