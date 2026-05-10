package com.backendPet.repo;

import com.backendPet.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    // Buscar animales de un refugio concreto
    List<Animal> findByRefugioId(Long refugioId);

    // Buscar animales por especie
    List<Animal> findByEspecie(String especie);

    // Buscar animales disponibles
    List<Animal> findByEstadoAdopcion(Animal.EstadoAdopcion estadoAdopcion);
}
