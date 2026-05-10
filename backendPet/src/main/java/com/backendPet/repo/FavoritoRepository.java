package com.backendPet.repo;

import com.backendPet.model.Favorito;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByAdoptanteId(Long adoptanteId);

    boolean existsByAdoptanteIdAndAnimalId(Long adoptanteId, Long animalId);

    void deleteByAdoptanteIdAndAnimalId(Long adoptanteId, Long animalId);
}
