# Veterinaria Arévalo - Backend actualizado

Backend basado en el proyecto original Spring Boot 4.1.1 / Java 17 / PostgreSQL.

## Incluye

- Registro y verificación de correo con código de 4 dígitos, expiración de 15 minutos y reenvío con espera de 60 segundos.
- Recuperación de contraseña con código de 6 dígitos, hash BCrypt, expiración de 10 minutos, máximo 5 intentos y un solo uso.
- Configuración SMTP tomada de `spring.mail.username` y `spring.mail.password`; no hay credenciales de correo hardcodeadas en Java.
- Exportación de medicamentos a CSV UTF-8 y PDF. Solo ADMIN puede descargar.
- Endpoint de asistente IA protegido por JWT, integrado con API compatible con OpenAI. La clave se configura solo en el servidor.
- Se conserva el CRUD existente y sus permisos.
- El inicializador ya no crea un administrador con contraseña pública. Solo crea un ADMIN opcional si se activa explícitamente y no existe ningún ADMIN.

## Instalación local

1. Conserva una copia de seguridad de tu proyecto y de la base de datos.
2. Copia `application-local.properties.example` como `application-local.properties`. Si ya tienes un `application-local.properties`, NO lo sobrescribas: conserva los datos de PostgreSQL y actualiza solamente los valores de correo/JWT/IA que correspondan.
3. Completa PostgreSQL, SMTP y `app.jwt.secret`. No uses contraseñas de ejemplo.
4. Ejecuta `mvnw.cmd clean test` y luego `mvnw.cmd spring-boot:run`.
5. Hibernate `ddl-auto=update` agregará los campos de expiración y recuperación a la tabla `usuarios`; no borra los registros existentes.

## Configuración del correo remitente

Para que los mensajes salgan desde tu Gmail, configura en `application-local.properties`:

```properties
spring.mail.username=tu-cuenta@gmail.com
spring.mail.password=tu-contraseña-de-aplicación
GMAIL_API_ENABLED=false
```

La contraseña debe ser una contraseña de aplicación de Google, no la contraseña normal. Si activas Gmail API (`GMAIL_API_ENABLED=true`), el `GMAIL_REFRESH_TOKEN` debe pertenecer a la misma cuenta remitente. Cambiar `spring.mail.username` por sí solo no cambia la cuenta OAuth asociada a un refresh token anterior.

## Endpoints de autenticación (públicos)

- `POST /api/auth/registro` `{ "nombre": "...", "correo": "...", "password": "..." }`
- `POST /api/auth/verificar-codigo` `{ "correo": "...", "codigo": "1234" }`
- `POST /api/auth/reenviar-codigo` `{ "correo": "..." }`
- `POST /api/auth/solicitar-recuperacion` `{ "correo": "..." }`
- `POST /api/auth/restablecer-password` `{ "correo": "...", "codigo": "123456", "nuevaPassword": "..." }`
- `POST /api/auth/login` `{ "correo": "...", "password": "..." }`

La solicitud de recuperación responde de forma genérica para no revelar si un correo está registrado.

## Exportación de medicamentos (JWT ADMIN)

- `GET /api/medicamentos/exportar/csv`
- `GET /api/medicamentos/exportar/pdf`

Ambos descargan el inventario completo, incluidos activos e inactivos.

## Asistente IA (JWT ADMIN, VETERINARIO o USER)

- `POST /api/asistente/chat` `{ "mensaje": "¿Cómo agendo una cita?" }`
- Respuesta: `{ "respuesta": "..." }`

Variables de entorno: `APP_AI_ENABLED=true`, `OPENAI_API_KEY`, opcionalmente `OPENAI_MODEL=gpt-4o-mini` y `OPENAI_BASE_URL=https://api.openai.com/v1`.

El asistente orienta sobre el uso de la plataforma y bienestar general; no diagnostica ni prescribe medicamentos. Los mensajes se envían al proveedor de IA configurado. No se envían contraseñas ni tokens JWT al proveedor.

## Producción / Google Cloud

Configura como variables/secretos del servicio: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`, `JWT_SECRET`, `APP_AI_ENABLED`, `OPENAI_API_KEY`. Usa HTTPS en el frontend y restringe el acceso de red a PostgreSQL. No subas `application-local.properties` ni secretos al repositorio.

## Alcance del frontend

El selector de cuatro idiomas, botones para mostrar/ocultar contraseña, ajustes visuales del módulo de veterinarios y la interfaz del chat se implementan en Angular. Este backend entrega los endpoints para recuperación, reenvío, exportaciones y conversación con IA.
