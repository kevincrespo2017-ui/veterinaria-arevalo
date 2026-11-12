package com.veterinaria.veterinaria.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinaria.veterinaria.dto.CorreoRequest;
import com.veterinaria.veterinaria.dto.LoginRequest;
import com.veterinaria.veterinaria.dto.LoginResponse;
import com.veterinaria.veterinaria.dto.RegistroRequest;
import com.veterinaria.veterinaria.dto.RestablecerPasswordRequest;
import com.veterinaria.veterinaria.dto.VerificarCodigoRequest;
import com.veterinaria.veterinaria.exception.MensajeRespuesta;
import com.veterinaria.veterinaria.model.Usuario;
import com.veterinaria.veterinaria.service.AuthService;
import com.veterinaria.veterinaria.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;

    public AuthController(UsuarioService usuarioService, AuthService authService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<MensajeRespuesta> registrarUsuario(@Valid @RequestBody RegistroRequest request) {
        Usuario usuario = usuarioService.registrarUsuario(request);
        return ResponseEntity.ok(new MensajeRespuesta(
                200, "Usuario registrado correctamente",
                "Se envió un código de verificación al correo " + usuario.getCorreo()));
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<MensajeRespuesta> verificarCodigo(@Valid @RequestBody VerificarCodigoRequest request) {
        usuarioService.verificarCodigo(request.getCorreo(), request.getCodigo());
        return ResponseEntity.ok(new MensajeRespuesta(200,
                "Cuenta verificada correctamente", "El código fue validado correctamente"));
    }

    @PostMapping("/reenviar-codigo")
    public ResponseEntity<MensajeRespuesta> reenviarCodigo(@Valid @RequestBody CorreoRequest request) {
        usuarioService.reenviarCodigoVerificacion(request.getCorreo());
        return ResponseEntity.ok(new MensajeRespuesta(200,
                "Solicitud procesada", "Si existe una cuenta pendiente de verificación, se enviará un nuevo código."));
    }

    @PostMapping("/solicitar-recuperacion")
    public ResponseEntity<MensajeRespuesta> solicitarRecuperacion(@Valid @RequestBody CorreoRequest request) {
        usuarioService.solicitarRecuperacionPassword(request.getCorreo());
        return ResponseEntity.ok(new MensajeRespuesta(200,
                "Solicitud procesada", "Si el correo corresponde a una cuenta activa y verificada, recibirás instrucciones para recuperar tu contraseña."));
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<MensajeRespuesta> restablecerPassword(@Valid @RequestBody RestablecerPasswordRequest request) {
        usuarioService.restablecerPassword(
                request.getCorreo(), request.getCodigo(), request.getNuevaPassword());
        return ResponseEntity.ok(new MensajeRespuesta(200,
                "Contraseña actualizada", "Ya puedes iniciar sesión con tu nueva contraseña."));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
