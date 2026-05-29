package com.backendPet.repo;

import com.backendPet.model.SolicitudAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudAdopcionRepository extends JpaRepository<SolicitudAdopcion, Long> {

    // Solicitudes de un adoptante concreto
    List<SolicitudAdopcion> findByAdoptanteId(Long adoptanteId);

    // Solicitudes de un animal concreto
    @Query("SELECT s FROM SolicitudAdopcion s WHERE s.animal.id = :animalId")
    List<SolicitudAdopcion> findByAnimalId(@Param("animalId") Long animalId);

    // Solicitudes pendientes
    List<SolicitudAdopcion> findByEstadoSolicitud(
        SolicitudAdopcion.EstadoSolicitud estadoSolicitud);

    // Verificar si existe una solicitud pendiente del adoptante para un animal
    boolean existsByAdoptanteIdAndAnimalIdAndEstadoSolicitud(
        Long adoptanteId,
        Long animalId,
        SolicitudAdopcion.EstadoSolicitud estadoSolicitud);

    // ADMIN
    void deleteByAdoptanteId(Long adoptanteId);
    void deleteByAnimalId(Long animalId);
}