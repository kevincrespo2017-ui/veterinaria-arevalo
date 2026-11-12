
package com.veterinaria.veterinaria.service;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AsistenteService {

    private static final Logger log =
            LoggerFactory.getLogger(AsistenteService.class);

    private static final String INSTRUCCIONES = """
            Eres el asistente de ayuda de Veterinaria Arévalo.
            Responde en español, con claridad y de forma amable.

            Ayuda a los usuarios a entender cómo utilizar el sistema:
            registro, inicio de sesión, recuperación de contraseña,
            mascotas, citas, servicios, veterinarios, atenciones,
            facturas y medicamentos.

            También puedes ofrecer orientación general sobre bienestar animal.

            No diagnostiques enfermedades, no prescribas medicamentos
            ni indiques dosis.

            Si describen síntomas graves, dificultad respiratoria,
            convulsiones, sangrado abundante, intoxicación o dolor intenso,
            recomienda acudir inmediatamente a un veterinario.

            No afirmes que puedes consultar datos privados de las cuentas.
            No inventes citas, precios, disponibilidad ni historiales.

            Si no conoces un dato específico de la clínica,
            recomienda consultar al personal.
            """;

    private final String apiKey;
    private final String model;
    private final boolean enabled;
    private final RestClient client;

    public AsistenteService(
            @Value("${app.ai.enabled:false}") boolean enabled,
            @Value("${app.ai.api-key:}") String apiKey,
            @Value("${app.ai.model:gpt-4o-mini}") String model,
            @Value("${app.ai.base-url:https://api.openai.com/v1}") String baseUrl) {

        this.enabled = enabled;
        this.apiKey = apiKey == null ? "" : apiKey.trim();

        this.model = model == null || model.isBlank()
                ? "gpt-4o-mini"
                : model.trim();

        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(45));

        String normalizedBase =
                (baseUrl == null || baseUrl.isBlank())
                        ? "https://api.openai.com/v1"
                        : baseUrl.trim();

        while (normalizedBase.endsWith("/")) {
            normalizedBase = normalizedBase.substring(
                    0, normalizedBase.length() - 1);
        }

        this.client = RestClient.builder()
                .baseUrl(normalizedBase)
                .requestFactory(factory)
                .build();
    }

    public String responder(String mensaje) {

        // Comprobar configuración de Groq.
        if (!enabled || apiKey.isBlank()) {

            log.warn("El asistente IA está deshabilitado o no tiene API Key.");

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "El asistente de IA no está configurado."
            );
        }

        // Validar el mensaje.
        if (mensaje == null || mensaje.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe escribir una pregunta."
            );
        }

        // Preparar solicitud compatible con Groq.
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of(
                                "role", "system",
                                "content", INSTRUCCIONES
                        ),
                        Map.of(
                                "role", "user",
                                "content", mensaje.trim()
                        )
                ),
                "temperature", 0.4,
                "max_completion_tokens", 500
        );

        try {

            log.info("Consultando asistente de IA. Modelo: {}", model);

            // Recibir respuesta como Map para evitar conflictos Jackson.
            Map<?, ?> response = client.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            // Obtener choices.
            Object choicesObject = response == null
                    ? null
                    : response.get("choices");

            if (!(choicesObject instanceof List<?> choices)
                    || choices.isEmpty()) {

                log.error("Groq devolvió una respuesta sin opciones válidas.");

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "El proveedor de IA devolvió una respuesta vacía."
                );
            }

            // Obtener primera respuesta.
            Object firstChoice = choices.get(0);

            if (!(firstChoice instanceof Map<?, ?> choice)) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Formato de respuesta no válido."
                );
            }

            // Obtener mensaje.
            Object messageObject = choice.get("message");

            if (!(messageObject instanceof Map<?, ?> message)) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "No se encontró el mensaje del asistente."
                );
            }

            // Obtener contenido generado.
            Object contentObject = message.get("content");

            if (!(contentObject instanceof String content)
                    || content.isBlank()) {

                log.error("Groq devolvió contenido vacío o inválido.");

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "El asistente no generó una respuesta válida."
                );
            }

            log.info("Respuesta del asistente generada correctamente.");

            return content.trim();

        } catch (RestClientResponseException ex) {

            // Registrar el error real del proveedor.
            String detalle = ex.getResponseBodyAsString();

            if (detalle == null || detalle.isBlank()) {
                detalle = "El proveedor no devolvió detalles.";
            }

            detalle = detalle.replace(apiKey, "[API_KEY_OCULTA]");

            if (detalle.length() > 1500) {
                detalle = detalle.substring(0, 1500);
            }

            log.error(
                    "ERROR GROQ - HTTP {} - Detalle: {}",
                    ex.getStatusCode().value(),
                    detalle
            );

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "No fue posible obtener una respuesta del asistente de IA."
            );

        } catch (ResponseStatusException ex) {

            throw ex;

        } catch (Exception ex) {

            log.error(
                    "ERROR DE COMUNICACION CON GROQ: {}",
                    ex.getMessage(),
                    ex
            );

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "El asistente de IA no está disponible en este momento."
            );
        }
    }
}
