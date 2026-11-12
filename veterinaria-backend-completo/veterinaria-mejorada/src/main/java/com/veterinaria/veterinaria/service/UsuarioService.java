package com.veterinaria.veterinaria.service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.veterinaria.veterinaria.dto.RegistroRequest;
import com.veterinaria.veterinaria.exception.BadRequestException;
import com.veterinaria.veterinaria.exception.DuplicateResourceException;
import com.veterinaria.veterinaria.exception.ResourceNotFoundException;
import com.veterinaria.veterinaria.model.EstadoUsuario;
import com.veterinaria.veterinaria.model.Rol;
import com.veterinaria.veterinaria.model.Usuario;
import com.veterinaria.veterinaria.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final int verificacionExpiraMinutos;
    private final int recuperacionExpiraMinutos;
    private final int segundosEntreEnvios;
    private final int maxIntentosRecuperacion;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            @Value("${app.auth.verification-expiration-minutes:15}") int verificacionExpiraMinutos,
            @Value("${app.auth.reset-expiration-minutes:10}") int recuperacionExpiraMinutos,
            @Value("${app.auth.resend-cooldown-seconds:60}") int segundosEntreEnvios,
            @Value("${app.auth.reset-max-attempts:5}") int maxIntentosRecuperacion) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.verificacionExpiraMinutos = verificacionExpiraMinutos;
        this.recuperacionExpiraMinutos = recuperacionExpiraMinutos;
        this.segundosEntreEnvios = segundosEntreEnvios;
        this.maxIntentosRecuperacion = maxIntentosRecuperacion;
    }

    public Usuario registrarUsuario(RegistroRequest request) {
        String correo = normalizarCorreo(request.getCorreo());
        if (usuarioRepository.findByCorreoIgnoreCase(correo).isPresent()) {
            throw new DuplicateResourceException("El correo ya se encuentra registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.USER);
        usuario.setEstado(EstadoUsuario.PENDIENTE);
        usuario.setVerificado(false);
        usuario.setActivo(true);

        LocalDateTime ahora = LocalDateTime.now();
        String codigo = generarCodigo(4);
        usuario.setCodigoVerificacion(codigo);
        usuario.setCodigoVerificacionExpiraEn(ahora.plusMinutes(verificacionExpiraMinutos));
        usuario.setUltimoEnvioCodigoEn(ahora);
        usuario.setFechaCreacion(ahora);

        Usuario guardado = usuarioRepository.save(usuario);
        emailService.enviarCodigoVerificacion(guardado.getCorreo(), codigo);
        return guardado;
    }

    public void verificarCodigo(String correo, String codigo) {
        String email = normalizarCorreo(correo);
        if (codigo == null || !codigo.trim().matches("^[0-9]{4}$")) {
            throw new BadRequestException("Debe ingresar un código válido de cuatro dígitos");
        }

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("No existe un usuario registrado con ese correo"));

        if (usuario.isVerificado()) {
            throw new BadRequestException("La cuenta ya se encuentra verificada");
        }
        if (usuario.getCodigoVerificacion() == null) {
            throw new BadRequestException("No existe un código pendiente. Solicite uno nuevo.");
        }
        if (usuario.getCodigoVerificacionExpiraEn() == null
                || LocalDateTime.now().isAfter(usuario.getCodigoVerificacionExpiraEn())) {
            usuario.setCodigoVerificacion(null);
            usuario.setCodigoVerificacionExpiraEn(null);
            usuarioRepository.save(usuario);
            throw new BadRequestException("El código ha vencido. Solicite uno nuevo.");
        }
        if (!usuario.getCodigoVerificacion().equals(codigo.trim())) {
            throw new BadRequestException("El código de verificación es incorrecto");
        }

        usuario.setVerificado(true);
        usuario.setCodigoVerificacion(null);
        usuario.setCodigoVerificacionExpiraEn(null);
        usuario.setUltimoEnvioCodigoEn(null);
        usuarioRepository.save(usuario);
    }

    public void reenviarCodigoVerificacion(String correo) {
        String email = normalizarCorreo(correo);
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(email).orElse(null);

        // Respuesta uniforme para no revelar si una dirección está registrada.
        if (usuario == null || usuario.isVerificado() || !usuario.isActivo()) {
            return;
        }
        validarTiempoReenvio(usuario.getUltimoEnvioCodigoEn());

        LocalDateTime ahora = LocalDateTime.now();
        String nuevoCodigo = generarCodigo(4);
        usuario.setCodigoVerificacion(nuevoCodigo);
        usuario.setCodigoVerificacionExpiraEn(ahora.plusMinutes(verificacionExpiraMinutos));
        usuario.setUltimoEnvioCodigoEn(ahora);
        usuarioRepository.save(usuario);
        emailService.enviarCodigoVerificacion(email, nuevoCodigo);
    }

    public void solicitarRecuperacionPassword(String correo) {
        String email = normalizarCorreo(correo);
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(email).orElse(null);

        // No confirmar si la cuenta existe. La API devuelve el mismo mensaje.
        if (usuario == null || !usuario.isVerificado() || !usuario.isActivo()) {
            return;
        }
        LocalDateTime ahora = LocalDateTime.now();
        if (usuario.getUltimoEnvioRecuperacionEn() != null
                && ahora.isBefore(usuario.getUltimoEnvioRecuperacionEn().plusSeconds(segundosEntreEnvios))) {
            return;
        }

        String codigo = generarCodigo(6);
        usuario.setCodigoRecuperacionHash(passwordEncoder.encode(codigo));
        usuario.setCodigoRecuperacionExpiraEn(ahora.plusMinutes(recuperacionExpiraMinutos));
        usuario.setUltimoEnvioRecuperacionEn(ahora);
        usuario.setIntentosRecuperacion(0);
        usuarioRepository.save(usuario);
        emailService.enviarCodigoRecuperacion(email, codigo);
    }

    public void restablecerPassword(String correo, String codigo, String nuevaPassword) {
        String email = normalizarCorreo(correo);
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("El código no es válido o ha vencido"));

        if (!usuario.isActivo() || !usuario.isVerificado()) {
            throw new BadRequestException("El código no es válido o ha vencido. Solicite uno nuevo.");
        }
        if (nuevaPassword == null || nuevaPassword.getBytes(StandardCharsets.UTF_8).length > 72
                || nuevaPassword.length() < 8) {
            throw new BadRequestException("La contraseña debe tener al menos 8 caracteres y no superar 72 bytes UTF-8");
        }
        if (codigo == null || !codigo.trim().matches("^[0-9]{6}$")
                || usuario.getCodigoRecuperacionHash() == null
                || usuario.getCodigoRecuperacionExpiraEn() == null
                || LocalDateTime.now().isAfter(usuario.getCodigoRecuperacionExpiraEn())
                || usuario.getIntentosRecuperacion() >= maxIntentosRecuperacion) {
            limpiarRecuperacion(usuario);
            usuarioRepository.save(usuario);
            throw new BadRequestException("El código no es válido o ha vencido. Solicite uno nuevo.");
        }

        if (!passwordEncoder.matches(codigo.trim(), usuario.getCodigoRecuperacionHash())) {
            int intentos = usuario.getIntentosRecuperacion() + 1;
            usuario.setIntentosRecuperacion(intentos);
            if (intentos >= maxIntentosRecuperacion) {
                limpiarRecuperacion(usuario);
            }
            usuarioRepository.save(usuario);
            throw new BadRequestException(intentos >= maxIntentosRecuperacion
                    ? "Se alcanzó el máximo de intentos. Solicite un nuevo código."
                    : "El código ingresado es incorrecto");
        }

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        limpiarRecuperacion(usuario);
        usuarioRepository.save(usuario);
    }

    private void limpiarRecuperacion(Usuario usuario) {
        usuario.setCodigoRecuperacionHash(null);
        usuario.setCodigoRecuperacionExpiraEn(null);
        usuario.setUltimoEnvioRecuperacionEn(null);
        usuario.setIntentosRecuperacion(0);
    }

    private void validarTiempoReenvio(LocalDateTime ultimoEnvio) {
        if (ultimoEnvio != null) {
            LocalDateTime disponible = ultimoEnvio.plusSeconds(segundosEntreEnvios);
            if (LocalDateTime.now().isBefore(disponible)) {
                long restantes = Math.max(1, java.time.Duration.between(LocalDateTime.now(), disponible).getSeconds());
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Espere " + restantes + " segundos antes de solicitar otro código");
            }
        }
    }

    private String generarCodigo(int digitos) {
        int limite = (int) Math.pow(10, digitos);
        int numero = RANDOM.nextInt(limite);
        return String.format(Locale.ROOT, "%0" + digitos + "d", numero);
    }

    private String normalizarCorreo(String correo) {
        if (correo == null || correo.isBlank()) {
            throw new BadRequestException("El correo es obligatorio");
        }
        return correo.trim().toLowerCase(Locale.ROOT);
    }
}
