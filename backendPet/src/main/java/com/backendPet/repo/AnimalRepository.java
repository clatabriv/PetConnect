package com.backendPet.repo;

import com.backendPet.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    // Buscar animales de un refugio concreto
    // Nota: refugio_Id navega la relación refugio y accede a su campo id
    List<Animal> findByRefugio_Id(Long refugioId);

    // Buscar animales por especie
    List<Animal> findByEspecie(String especie);

    // Buscar animales disponibles
    List<Animal> findByEstadoAdopcion(Animal.EstadoAdopcion estadoAdopcion);

    // Animales de refugios verificados
    List<Animal> findByRefugio_VerificadoTrue();

    // Animales disponibles de refugios verificados
    List<Animal> findByEstadoAdopcionAndRefugio_VerificadoTrue(Animal.EstadoAdopcion estado);
}