package com.backendPet.service;

import com.backendPet.model.Animal;
import com.backendPet.model.Favorito;
import com.backendPet.model.Usuario;
import com.backendPet.repo.AnimalRepository;
import com.backendPet.repo.FavoritoRepository;
import com.backendPet.repo.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;
    private final AuthContextService authContextService;

    public FavoritoService(
        FavoritoRepository favoritoRepository,
        UsuarioRepository usuarioRepository,
        AnimalRepository animalRepository,
        AuthContextService authContextService
    ) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
        this.authContextService = authContextService;
    }

    @Transactional(readOnly = true)
    public List<Animal> listarFavoritos(Long adoptanteId) {
        Usuario actor = authContextService.currentUser();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(adoptanteId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes ver favoritos de otro usuario");
        }

        return favoritoRepository.findByAdoptanteId(adoptanteId)
            .stream()
            .map(Favorito::getAnimal)
            .toList();
    }

    @Transactional
    public void agregarFavorito(Long adoptanteId, Long animalId) {
        Usuario actor = authContextService.currentUser();
        if (!actor.getId().equals(adoptanteId) && !authContextService.isAdmin(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes editar favoritos de otro usuario");
        }
        if (actor.getRol() != Usuario.Rol.ADOPTANTE && !authContextService.isAdmin(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo un adoptante puede guardar favoritos");
        }

        Usuario adoptante = usuarioRepository.findById(adoptanteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Adoptante no encontrado"));
        Animal animal = animalRepository.findById(animalId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Animal no encontrado"));

        if (favoritoRepository.existsByAdoptanteIdAndAnimalId(adoptanteId, animalId)) {
            return;
        }

        Favorito favorito = new Favorito();
        favorito.setAdoptante(adoptante);
        favorito.setAnimal(animal);
        favoritoRepository.save(favorito);
    }

    @Transactional
    public void eliminarFavorito(Long adoptanteId, Long animalId) {
        Usuario actor = authContextService.currentUser();
        if (!actor.getId().equals(adoptanteId) && !authContextService.isAdmin(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes editar favoritos de otro usuario");
        }
        favoritoRepository.deleteByAdoptanteIdAndAnimalId(adoptanteId, animalId);
    }
}
