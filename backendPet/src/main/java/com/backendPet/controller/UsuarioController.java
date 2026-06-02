package com.backendPet.controller;

import com.backendPet.model.Usuario;
import com.backendPet.service.AuthContextService;
import com.backendPet.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthContextService authContextService;

    public UsuarioController(UsuarioService usuarioService, AuthContextService authContextService) {
        this.usuarioService = usuarioService;
        this.authContextService = authContextService;
    }

    /**
     * Endpoint de administracion para listar usuarios.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/usuarios/{id}")
    public Usuario obtenerUsuario(@PathVariable Long id) {
        return usuarioService.findById(id);
    }

    @GetMapping("/refugios/{id}")
    public Usuario obtenerRefugioPublico(@PathVariable Long id) {
        Usuario u = usuarioService.findById(id);
        if (u.getRol() != Usuario.Rol.REFUGIO) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refugio no encontrado");
        }
        // ✅ Añadir esta comprobación
        if (Boolean.FALSE.equals(u.getVerificado())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refugio no disponible");
        }
        return u;
    }

    @GetMapping("/usuarios/me")
    public Usuario usuarioActual() {
        return authContextService.currentUser();
    }

    @GetMapping("/usuarios/refugios")
public List<Usuario> listarRefugios(@RequestParam(required = false) Boolean pendientes) {
    List<Usuario> refugios = usuarioService.findByRol(Usuario.Rol.REFUGIO);
    
    if (Boolean.TRUE.equals(pendientes)) {
        return refugios.stream()
            .filter(u -> Boolean.FALSE.equals(u.getVerificado()))
            .collect(Collectors.toList());
    }
    
    return refugios.stream()
        .filter(u -> Boolean.TRUE.equals(u.getVerificado()))
        .collect(Collectors.toList());
}

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/usuarios")
    public Usuario crearUsuario(@Valid @RequestBody Usuario usuario) {
        usuario.setId(null);
        return usuarioService.create(usuario);
    }

    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @PutMapping("/usuarios/{id}/perfil")
    public Usuario editarPerfilRefugio(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario actor = authContextService.currentUser();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Solo puedes editar tu propio perfil");
        }
        return usuarioService.updatePerfilRefugio(id, usuario);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/usuarios/{id}")
    public Usuario editarUsuario(@PathVariable Long id,
            @Valid @RequestBody Usuario usuario) {
        return usuarioService.update(id, usuario);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/usuarios/{id}")
    public void borrarUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
    }

    // -------- LOGIN --------
    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        return usuarioService.login(email, password);
    }

    // PARA MI PERFIL
    // ── Perfil propio del adoptante ──
    @GetMapping("/mi-perfil")
    public Usuario miPerfil() {
        return authContextService.currentUser();
    }

    @PreAuthorize("hasRole('ADOPTANTE')")
    @PutMapping("/mi-perfil")
    public Usuario actualizarMiPerfil(@RequestBody Map<String, String> datos) {
        Usuario actor = authContextService.currentUser();
        return usuarioService.updatePerfilAdoptante(actor.getId(), datos);
    }

    @PreAuthorize("hasRole('ADOPTANTE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/mi-cuenta")
    public void eliminarMiCuenta() {
        Usuario actor = authContextService.currentUser();
        usuarioService.delete(actor.getId());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/usuarios/{id}/verificacion")
    public Usuario cambiarVerificacion(@PathVariable Long id, @RequestBody Map<String, Boolean> datos) {
        Boolean verificado = datos.get("verificado");
        return usuarioService.cambiarEstadoVerificacion(id, verificado);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/usuarios/refugios-pendientes")
    public List<Usuario> listarRefugiosPendientes() {
        return usuarioService.findByRol(Usuario.Rol.REFUGIO).stream()
            .filter(u -> Boolean.FALSE.equals(u.getVerificado()))
            .toList();
    }
    
   @PreAuthorize("hasRole('REFUGIO')")
   @ResponseStatus(HttpStatus.NO_CONTENT)
   @DeleteMapping("/mi-refugio")
    public void eliminarMiRefugio() {
        Usuario actor = authContextService.currentUser();
        usuarioService.delete(actor.getId());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/usuarios/admin")
    public Usuario crearUsuarioAdmin(@Valid @RequestBody Usuario usuario) {
        usuario.setId(null);
        return usuarioService.create(usuario);
    }
}
