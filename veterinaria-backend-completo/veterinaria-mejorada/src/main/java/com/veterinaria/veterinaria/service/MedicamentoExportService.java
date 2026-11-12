package com.veterinaria.veterinaria.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.veterinaria.veterinaria.model.Medicamento;
import com.veterinaria.veterinaria.repository.MedicamentoRepository;

@Service
public class MedicamentoExportService {

    private final MedicamentoRepository repository;

    public MedicamentoExportService(MedicamentoRepository repository) {
        this.repository = repository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public byte[] exportarCsv() {
        List<Medicamento> medicamentos = repository.findAll(
                org.springframework.data.domain.Sort.by("nombre").ascending());
        StringBuilder csv = new StringBuilder("\uFEFF");
        csv.append("ID,Nombre,Descripción,Presentación,Concentración,Unidad de medida,Precio unitario,Stock disponible,Estado\r\n");
        for (Medicamento m : medicamentos) {
            csv.append(celda(m.getId())).append(',')
                    .append(celda(m.getNombre())).append(',')
                    .append(celda(m.getDescripcion())).append(',')
                    .append(celda(m.getPresentacion())).append(',')
                    .append(celda(m.getConcentracion())).append(',')
                    .append(celda(m.getUnidadMedida())).append(',')
                    .append(celda(m.getPrecioUnitario())).append(',')
                    .append(celda(m.getStockDisponible())).append(',')
                    .append(celda(m.isActivo() ? "Activo" : "Inactivo"))
                    .append("\r\n");
        }
        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public byte[] exportarPdf() {
        List<Medicamento> medicamentos = repository.findAll(
                org.springframework.data.domain.Sort.by("nombre").ascending());

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDFont normal = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDFont bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDPageContentStream[] stream = new PDPageContentStream[1];
            float[] y = new float[1];
            int[] pageNumber = new int[1];

            RunnableWithIOException nuevaPagina = () -> {
                if (stream[0] != null) stream[0].close();
                PDPage page = new PDPage(PDRectangle.A4);
                document.addPage(page);
                stream[0] = new PDPageContentStream(document, page);
                pageNumber[0]++;
                y[0] = page.getMediaBox().getHeight() - 48;
                texto(stream[0], bold, 18, 42, y[0], "VETERINARIA AREVALO - INVENTARIO DE MEDICAMENTOS");
                y[0] -= 24;
                texto(stream[0], normal, 9, 42, y[0], "Generado: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        + " | Registros: " + medicamentos.size());
                y[0] -= 20;
                texto(stream[0], normal, 8, 42, y[0], "Pagina " + pageNumber[0]);
                y[0] -= 22;
                linea(stream[0], 42, y[0], 553, y[0]);
                y[0] -= 22;
            };

            nuevaPagina.run();
            if (medicamentos.isEmpty()) {
                texto(stream[0], normal, 11, 42, y[0], "No existen medicamentos registrados.");
            }

            for (Medicamento m : medicamentos) {
                if (y[0] < 105) {
                    nuevaPagina.run();
                }
                String titulo = "#" + m.getId() + " - " + valor(m.getNombre());
                texto(stream[0], bold, 11, 42, y[0], limitar(titulo, 92));
                y[0] -= 16;
                texto(stream[0], normal, 9, 52, y[0], "Presentacion: " + valor(m.getPresentacion())
                        + " | Concentracion: " + valor(m.getConcentracion()));
                y[0] -= 14;
                texto(stream[0], normal, 9, 52, y[0], "Unidad: " + valor(m.getUnidadMedida())
                        + " | Precio: " + valor(m.getPrecioUnitario())
                        + " | Stock: " + valor(m.getStockDisponible())
                        + " | Estado: " + (m.isActivo() ? "Activo" : "Inactivo"));
                y[0] -= 14;
                if (m.getDescripcion() != null && !m.getDescripcion().isBlank()) {
                    texto(stream[0], normal, 8, 52, y[0], "Descripcion: " + limitar(m.getDescripcion(), 105));
                    y[0] -= 14;
                }
                linea(stream[0], 52, y[0], 553, y[0]);
                y[0] -= 18;
            }

            if (stream[0] != null) stream[0].close();
            document.save(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No fue posible generar el PDF del inventario", ex);
        }
    }

    private static String celda(Object value) {
        String text = value == null ? "" : value.toString();
        if (!text.isEmpty() && "=+-@".indexOf(text.charAt(0)) >= 0) text = "'" + text;
        return "\"" + text.replace("\"", "\"\"").replace("\r", " ").replace("\n", " ") + "\"";
    }

    private static String valor(Object value) {
        return value == null ? "-" : value.toString();
    }

    private static String limitar(String value, int max) {
        String clean = value == null ? "-" : value.replaceAll("[\\r\\n\\t]+", " ");
        return clean.length() <= max ? clean : clean.substring(0, max - 3) + "...";
    }

    private static void texto(PDPageContentStream stream, PDFont font, float size,
                              float x, float y, String value) throws IOException {
        String clean = limitar(value, 150).replaceAll("[^\\u0020-\\u00FF]", " ");
        stream.beginText();
        stream.setFont(font, size);
        stream.newLineAtOffset(x, y);
        stream.showText(clean);
        stream.endText();
    }

    private static void linea(PDPageContentStream stream, float x1, float y1,
                              float x2, float y2) throws IOException {
        stream.moveTo(x1, y1);
        stream.lineTo(x2, y2);
        stream.stroke();
    }

    @FunctionalInterface
    private interface RunnableWithIOException {
        void run() throws IOException;
    }
}
