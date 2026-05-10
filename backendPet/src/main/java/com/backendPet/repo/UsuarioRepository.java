package com.backendPet.repo;

import com.backendPet.model.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Para el login, buscar usuario por email
    Optional<Usuario> findByEmail(String email);
    
    // Para comprobar si el email ya existe en el registro
    boolean existsByEmail(String email);

    List<Usuario> findByRol(Usuario.Rol rol);
}
