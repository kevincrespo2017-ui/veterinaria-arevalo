package com.veterinaria.veterinaria.repository;


import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.veterinaria.veterinaria.model.Usuario;
import com.veterinaria.veterinaria.model.EstadoUsuario;
import com.veterinaria.veterinaria.model.Rol;



@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {



    // Buscar usuario por correo para login
    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    boolean existsByRol(Rol rol);



    // Buscar usuarios por estado
    List<Usuario> findByEstado(EstadoUsuario estado);



    // Buscar usuario por código de verificación
    Optional<Usuario> findByCodigoVerificacion(String codigo);



}