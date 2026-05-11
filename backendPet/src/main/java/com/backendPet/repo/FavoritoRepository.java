package com.backendPet.repo;

import com.backendPet.model.Favorito;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByAdoptanteId(Long adoptanteId);

    boolean existsByAdoptanteIdAndAnimalId(Long adoptanteId, Long animalId);

    void deleteByAdoptanteIdAndAnimalId(Long adoptanteId, Long animalId);
    
    // ADMIN
    void deleteByAdoptanteId(Long adoptanteId);

    // ADMIN
    void deleteByAnimalId(Long animalId);
    
    @Query("SELECT f FROM Favorito f JOIN FETCH f.animal a LEFT JOIN FETCH a.refugio WHERE f.adoptante.id = :adoptanteId")
    List<Favorito> findByAdoptanteIdWithAnimal(@org.springframework.data.repository.query.Param("adoptanteId") Long adoptanteId);
}
