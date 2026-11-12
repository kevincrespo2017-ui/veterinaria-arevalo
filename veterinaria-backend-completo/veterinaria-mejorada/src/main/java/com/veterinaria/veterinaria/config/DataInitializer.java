package com.veterinaria.veterinaria.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.veterinaria.veterinaria.model.EstadoUsuario;
import com.veterinaria.veterinaria.model.Rol;
import com.veterinaria.veterinaria.model.Usuario;
import com.veterinaria.veterinaria.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner crearAdministrador(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.bootstrap.enabled:false}") boolean habilitado,
            @Value("${app.admin.bootstrap.email:}") String correo,
            @Value("${app.admin.bootstrap.password:}") String password) {

        return args -> {
            // No se crea una cuenta predeterminada con credenciales públicas.
            // Si ya existe un ADMIN, nunca se crea otro ni se modifica su cuenta.
            if (!habilitado || repository.existsByRol(Rol.ADMIN)) {
                return;
            }
            if (correo == null || correo.isBlank() || password == null || password.length() < 12) {
                throw new IllegalStateException(
                        "Para crear el primer administrador configure app.admin.bootstrap.email y una contraseña de al menos 12 caracteres.");
            }

            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setCorreo(correo.trim().toLowerCase(java.util.Locale.ROOT));
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRol(Rol.ADMIN);
            admin.setEstado(EstadoUsuario.APROBADA);
            admin.setVerificado(true);
            admin.setActivo(true);
            repository.save(admin);
            System.out.println("Se creó el administrador inicial configurado por entorno.");
        };
    }
}
