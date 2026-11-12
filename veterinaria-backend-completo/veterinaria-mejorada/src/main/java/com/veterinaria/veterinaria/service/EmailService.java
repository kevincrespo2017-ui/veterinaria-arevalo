package com.veterinaria.veterinaria.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final GmailApiSender gmailApiSender;
    private final String correoRemitente;

    public EmailService(
            JavaMailSender mailSender,
            GmailApiSender gmailApiSender,
            @Value("${spring.mail.username:}") String correoRemitente) {
        this.mailSender = mailSender;
        this.gmailApiSender = gmailApiSender;
        this.correoRemitente = correoRemitente == null ? "" : correoRemitente.trim();
    }

    public void enviarCodigoVerificacion(String correo, String codigo) {
        String html = plantillaCodigo(
                "Verifica tu correo electrónico",
                "Gracias por registrarte en Veterinaria Arévalo. Utiliza este código para verificar tu cuenta.",
                codigo,
                "El código vence en 15 minutos. Si no solicitaste este registro, ignora este mensaje."
        );
        enviar(correo, "Código de verificación - Veterinaria Arévalo", html,
                "Tu código de verificación es: " + codigo + ". Vence en 15 minutos.");
    }

    public void enviarCodigoRecuperacion(String correo, String codigo) {
        String html = plantillaCodigo(
                "Recuperación de contraseña",
                "Recibimos una solicitud para cambiar la contraseña de tu cuenta de Veterinaria Arévalo.",
                codigo,
                "El código vence en 10 minutos y solo puede utilizarse una vez. Si no solicitaste este cambio, ignora este mensaje."
        );
        enviar(correo, "Código para recuperar tu contraseña - Veterinaria Arévalo", html,
                "Tu código para recuperar la contraseña es: " + codigo + ". Vence en 10 minutos.");
    }

    private String plantillaCodigo(String titulo, String introduccion, String codigo, String aviso) {
        String codigoSeguro = escaparHtml(codigo);
        return """
                <!doctype html>
                <html lang="es"><head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:24px;background:#f3faf6;font-family:Arial,sans-serif;color:#183d33">
                  <main style="max-width:560px;margin:auto;background:#fff;border:1px solid #dcece2;border-radius:16px;overflow:hidden">
                    <header style="background:#08745a;color:#fff;text-align:center;padding:26px">
                      <h1 style="margin:0;font-size:24px">🐾 Veterinaria Arévalo</h1>
                      <p style="margin:8px 0 0">Cuidado y bienestar animal</p>
                    </header>
                    <section style="padding:30px">
                      <h2 style="color:#075e47">%s</h2>
                      <p style="line-height:1.7">%s</p>
                      <div style="margin:28px 0;text-align:center">
                        <span style="display:inline-block;padding:18px 28px;background:#e1f5e9;border:2px solid #08745a;border-radius:12px;color:#075e47;font-size:32px;font-weight:bold;letter-spacing:7px">%s</span>
                      </div>
                      <p style="font-size:13px;color:#71877c;line-height:1.7">%s</p>
                    </section>
                    <footer style="padding:18px;background:#f0f9f4;text-align:center;color:#688777;font-size:12px">© 2026 Veterinaria Arévalo · Sistema de gestión veterinaria</footer>
                  </main>
                </body></html>
                """.formatted(escaparHtml(titulo), escaparHtml(introduccion), codigoSeguro, escaparHtml(aviso));
    }

    private void enviar(String destinatario, String asunto, String html, String texto) {
        if (destinatario == null || destinatario.isBlank()) {
            throw new IllegalArgumentException("El correo destinatario es obligatorio");
        }
        if (correoRemitente.isBlank()) {
            throw new IllegalStateException("Configure spring.mail.username con la cuenta remitente");
        }

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setFrom(correoRemitente, "Veterinaria Arévalo");
            helper.setTo(destinatario.trim());
            helper.setSubject(asunto);
            helper.setText(texto, html);

            if (gmailApiSender.estaHabilitado()) {
                // Gmail API utiliza la cuenta asociada al refresh token.
                // Ese token debe pertenecer al mismo correo configurado como remitente.
                gmailApiSender.enviar(mensaje);
                log.info("Correo aceptado por Gmail API para destinatario {}", destinatario.trim());
            } else {
                mailSender.send(mensaje);
                log.info("Correo aceptado por SMTP para destinatario {}", destinatario.trim());
            }
        } catch (MessagingException ex) {
            log.error("No se pudo construir el correo para {}", destinatario, ex);
            throw new IllegalStateException("No se pudo preparar el correo electrónico", ex);
        } catch (Exception ex) {
            log.error("Falló el envío de correo para {}. Revise la cuenta remitente y el proveedor configurado.", destinatario, ex);
            throw new IllegalStateException("No se pudo enviar el correo electrónico. Revise la configuración del remitente.", ex);
        }
    }

    private String escaparHtml(String valor) {
        if (valor == null) return "";
        return valor.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
