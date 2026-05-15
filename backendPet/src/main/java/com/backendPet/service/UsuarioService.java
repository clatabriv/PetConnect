package com.backendPet.service;

import com.backendPet.model.Usuario;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

// Añade estos imports arriba del todo en UsuarioService.java:
import com.backendPet.repo.FavoritoRepository;
import com.backendPet.repo.SolicitudAdopcionRepository;
import com.backendPet.repo.AnimalRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final FavoritoRepository favoritoRepository;
    private final SolicitudAdopcionRepository solicitudRepository;
    private final AnimalRepository animalRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, FavoritoRepository favoritoRepository, SolicitudAdopcionRepository solicitudRepository,
            AnimalRepository animalRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.favoritoRepository = favoritoRepository;
        this.solicitudRepository = solicitudRepository;
        this.animalRepository = animalRepository;
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
        existing.setDescripcion(u.getDescripcion());
        existing.setFoto(u.getFoto());
        existing.setTelefono(u.getTelefono());
        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(u.getPassword()));
        }
        return usuarioRepository.save(existing);
    }

    public Usuario updatePerfilRefugio(Long id, Usuario u) {
        Usuario existing = findById(id);
        existing.setNombre(u.getNombre());
        existing.setDescripcion(u.getDescripcion());
        existing.setFoto(u.getFoto());
        existing.setTelefono(u.getTelefono());
        return usuarioRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Usuario usuario = findById(id);

        if (usuario.getRol() == Usuario.Rol.ADOPTANTE) {
            // Borrar favoritos y solicitudes del adoptante
            favoritoRepository.deleteByAdoptanteId(id);
            solicitudRepository.deleteByAdoptanteId(id);

        } else if (usuario.getRol() == Usuario.Rol.REFUGIO) {
            // Para cada animal del refugio, borrar sus favoritos y solicitudes primero
            List<Long> animalIds = animalRepository.findByRefugioId(id)
                    .stream().map(a -> a.getId()).toList();

            for (Long animalId : animalIds) {
                favoritoRepository.deleteByAnimalId(animalId);
                solicitudRepository.deleteByAnimalId(animalId);
            }
            // Los animales se borran solos por CascadeType.ALL en Usuario
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
