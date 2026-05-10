package com.backendPet.controller;

import com.backendPet.model.Animal;
import com.backendPet.model.Usuario;
import com.backendPet.service.AuthContextService;
import com.backendPet.service.FavoritoService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class FavoritoController {

    private final FavoritoService favoritoService;
    private final AuthContextService authContextService;

    public FavoritoController(FavoritoService favoritoService, AuthContextService authContextService) {
        this.favoritoService = favoritoService;
        this.authContextService = authContextService;
    }

    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('ADMIN')")
    @GetMapping("/favoritos/mis")
    public List<Animal> listarMisFavoritos() {
        Usuario actor = authContextService.currentUser();
        return favoritoService.listarFavoritos(actor.getId());
    }

    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('ADMIN')")
    @GetMapping("/adoptantes/{adoptanteId}/favoritos")
    public List<Animal> listarFavoritosPorAdoptante(@PathVariable Long adoptanteId) {
        return favoritoService.listarFavoritos(adoptanteId);
    }

    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/adoptantes/{adoptanteId}/favoritos/{animalId}")
    public void agregarFavorito(@PathVariable Long adoptanteId, @PathVariable Long animalId) {
        favoritoService.agregarFavorito(adoptanteId, animalId);
    }

    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/adoptantes/{adoptanteId}/favoritos/{animalId}")
    public void quitarFavorito(@PathVariable Long adoptanteId, @PathVariable Long animalId) {
        favoritoService.eliminarFavorito(adoptanteId, animalId);
    }
}
