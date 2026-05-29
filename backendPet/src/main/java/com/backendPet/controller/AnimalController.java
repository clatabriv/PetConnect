package com.backendPet.controller;

import com.backendPet.model.Animal;
import com.backendPet.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    // -------- CRUD ANIMALES --------
    @GetMapping("/animales")
    public List<Animal> listarAnimales() {
        return animalService.findAll();
    }

    @GetMapping("/animales/{id}")
    public Animal obtenerAnimal(@PathVariable Long id) {
        return animalService.findById(id);
    }
    
    // Listar animales disponibles para adopción
    @GetMapping("/animales/disponibles")
    public List<Animal> listarDisponibles() {
        return animalService.findDisponibles();
    }

    // Listar animales de un refugio concreto
    @GetMapping("/refugios/{refugioId}/animales")
    public List<Animal> listarAnimalesDeRefugio(@PathVariable Long refugioId) {
        return animalService.findByRefugio(refugioId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @PostMapping("/refugios/{refugioId}/animales")
    public Animal crearAnimal(@PathVariable Long refugioId,
                               @Valid @RequestBody Animal animal) {
        animal.setId(null);
        return animalService.create(refugioId, animal);
    }

    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @PutMapping("/animales/{id}")
    public Animal editarAnimal(@PathVariable Long id,
                                @Valid @RequestBody Animal animal) {
        return animalService.update(id, animal);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @DeleteMapping("/animales/{id}")
    public void borrarAnimal(@PathVariable Long id) {
        animalService.delete(id);
    }
    
  
}