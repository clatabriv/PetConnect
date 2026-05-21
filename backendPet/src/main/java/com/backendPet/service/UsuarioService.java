package com.backendPet.service;

import com.backendPet.model.Usuario;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

import com.backendPet.repo.FavoritoRepository;
import com.backendPet.repo.SolicitudAdopcionRepository;
import com.backendPet.repo.AnimalRepository;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    
    public Usuario cambiarEstadoVerificacion(Long id, Boolean verificado) {
        Usuario u = findById(id);
        if (u.getRol() != Usuario.Rol.REFUGIO) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Solo los refugios pueden ser verificados");
        }
        u.setVerificado(verificado);
        return usuarioRepository.save(u);
    }

    public Usuario create(Usuario u) {
    if (usuarioRepository.existsByEmail(u.getEmail())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El email ya está registrado");
    }

    if (u.getRol() == Usuario.Rol.ADMIN) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean esAdmin = auth != null && auth.isAuthenticated()
            && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!esAdmin) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "No puedes registrarte como administrador");
        }
    }

    u.setId(null);
    u.setPassword(passwordEncoder.encode(u.getPassword()));
    
    // Los refugios empiezan sin verificar, los demás verificados por defecto
    if (u.getRol() == Usuario.Rol.REFUGIO) {
        u.setVerificado(false);
    } else {
        u.setVerificado(true);
    }
    
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
    
        if (u.getNombre() != null && !u.getNombre().isBlank()) {
            existing.setNombre(u.getNombre());
        }
        if (u.getDescripcion() != null) {
            existing.setDescripcion(u.getDescripcion());
        }
        if (u.getFoto() != null) {
            existing.setFoto(u.getFoto());
        }
        if (u.getTelefono() != null) {
            existing.setTelefono(u.getTelefono());
        }
    
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
            List<Long> animalIds = animalRepository.findByRefugio_Id(id)
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
    
    // MI PERFIL
    public Usuario updatePerfilAdoptante(Long id, Map<String, String> datos) {
    Usuario u = findById(id);
    if (datos.containsKey("nombre") && !datos.get("nombre").isBlank()) {
        u.setNombre(datos.get("nombre"));
    }
    if (datos.containsKey("foto")) {
        u.setFoto(datos.get("foto"));
    }
    if (datos.containsKey("ubicacion")) {
        u.setUbicacion(datos.get("ubicacion"));
    }
    if (datos.containsKey("descripcion")) {
        u.setDescripcion(datos.get("descripcion"));
    }
    return usuarioRepository.save(u);
    }
}
