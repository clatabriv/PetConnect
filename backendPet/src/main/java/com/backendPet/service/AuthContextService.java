package com.backendPet.service;

import com.backendPet.model.Usuario;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Servicio de apoyo para resolver el usuario autenticado y aplicar reglas de
 * autorizacion basadas en propietario o rol.
 */
@Service
public class AuthContextService {

    private final UsuarioRepository usuarioRepository;

    public AuthContextService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }

        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no valido"));
    }

    public boolean isAdmin(Usuario usuario) {
        return usuario.getRol() == Usuario.Rol.ADMIN;
    }
}
