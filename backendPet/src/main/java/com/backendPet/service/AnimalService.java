package com.backendPet.service;

import com.backendPet.model.Animal;
import com.backendPet.model.Usuario;
import com.backendPet.repo.AnimalRepository;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuthContextService authContextService;

    public AnimalService(AnimalRepository animalRepository,
                         UsuarioRepository usuarioRepository,
                         AuthContextService authContextService) {
        this.animalRepository = animalRepository;
        this.usuarioRepository = usuarioRepository;
        this.authContextService = authContextService;
    }

    public List<Animal> findAll() {
        return animalRepository.findAll();
    }

    public Animal findById(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Animal no encontrado"));
    }

    // Listar animales de un refugio concreto
    public List<Animal> findByRefugio(Long refugioId) {
        return animalRepository.findByRefugio_Id(refugioId);
    }

    // Listar animales disponibles
    public List<Animal> findDisponibles() {
        return animalRepository.findByEstadoAdopcion(
            Animal.EstadoAdopcion.DISPONIBLE);
    }

    public Animal create(Long refugioId, Animal animal) {
        Usuario actor = authContextService.currentUser();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(refugioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo puedes crear animales para tu refugio");
        }

        Usuario refugio = usuarioRepository.findById(refugioId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Refugio no encontrado"));

        // Comprobamos que el usuario sea realmente un refugio
        if (refugio.getRol() != Usuario.Rol.REFUGIO) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "El usuario no es un refugio");
        }

        animal.setId(null);
        animal.setRefugio(refugio);
        animal.setEstadoAdopcion(Animal.EstadoAdopcion.DISPONIBLE);
        return animalRepository.save(animal);
    }

    public Animal update(Long id, Animal animal) {
        Animal existing = findById(id);
        Usuario actor = authContextService.currentUser();
        Long ownerRefugioId = existing.getRefugio().getId();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(ownerRefugioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes editar animales de otro refugio");
        }

        existing.setNombre(animal.getNombre());
        existing.setEspecie(animal.getEspecie());
        existing.setRaza(animal.getRaza());
        existing.setEdad(animal.getEdad());
        existing.setEstadoSalud(animal.getEstadoSalud());
        existing.setUbicacion(animal.getUbicacion());
        existing.setFoto(animal.getFoto());
        existing.setEstadoAdopcion(animal.getEstadoAdopcion());
        existing.setDescripcion(animal.getDescripcion());  // ← añadir
        existing.setGenero(animal.getGenero());            // ← añadir
        return animalRepository.save(existing);
    }

    public void delete(Long id) {
        Animal existing = findById(id);
        Usuario actor = authContextService.currentUser();
        Long ownerRefugioId = existing.getRefugio().getId();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(ownerRefugioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes eliminar animales de otro refugio");
        }
        animalRepository.delete(existing);
    }
}