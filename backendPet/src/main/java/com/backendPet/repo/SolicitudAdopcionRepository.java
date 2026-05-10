package com.backendPet.repo;

import com.backendPet.model.SolicitudAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudAdopcionRepository extends JpaRepository<SolicitudAdopcion, Long> {

    // Solicitudes de un adoptante concreto
    List<SolicitudAdopcion> findByAdoptanteId(Long adoptanteId);

    // Solicitudes de un animal concreto
    List<SolicitudAdopcion> findByAnimalId(Long animalId);

    // Solicitudes pendientes
    List<SolicitudAdopcion> findByEstadoSolicitud(
        SolicitudAdopcion.EstadoSolicitud estadoSolicitud);
}