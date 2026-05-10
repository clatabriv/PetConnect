package com.backendPet.service;

import com.backendPet.model.Usuario;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> findByRol(Usuario.Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public Usuario create(Usuario u) {
        // Comprobamos que el email no esté ya registrado
        if (usuarioRepository.existsByEmail(u.getEmail())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El email ya está registrado");
        }
        u.setId(null); // Aseguramos que cree uno nuevo
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        return usuarioRepository.save(u);
    }

    public Usuario update(Long id, Usuario u) {
        Usuario existing = findById(id);
        existing.setNombre(u.getNombre());
        existing.setEmail(u.getEmail());
        existing.setRol(u.getRol());
        // Solo actualizamos password cuando llega valor no vacio.
        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(u.getPassword()));
        }
        return usuarioRepository.save(existing);
    }

    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    // Para el login
    public Usuario login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos"));

        boolean ok = passwordEncoder.matches(password, usuario.getPassword());
        if (!ok && password.equals(usuario.getPassword())) {
            // Compatibilidad con datos antiguos en texto plano; se migra en el login.
            usuario.setPassword(passwordEncoder.encode(password));
            usuarioRepository.save(usuario);
            ok = true;
        }

        if (!ok) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos");
        }
        return usuario;
    }
}