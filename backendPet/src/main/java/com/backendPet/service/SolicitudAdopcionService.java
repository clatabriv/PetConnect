package com.backendPet.service;

import com.backendPet.model.Animal;
import com.backendPet.model.SolicitudAdopcion;
import com.backendPet.model.Usuario;
import com.backendPet.repo.AnimalRepository;
import com.backendPet.repo.SolicitudAdopcionRepository;
import com.backendPet.repo.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitudAdopcionService {

    private final SolicitudAdopcionRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;
    private final AuthContextService authContextService;

    public SolicitudAdopcionService(SolicitudAdopcionRepository solicitudRepository,
                                     UsuarioRepository usuarioRepository,
                                     AnimalRepository animalRepository,
                                     AuthContextService authContextService) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
        this.authContextService = authContextService;
    }

    public List<SolicitudAdopcion> findAll() {
        return solicitudRepository.findAll();
    }

    public SolicitudAdopcion findById(Long id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Solicitud no encontrada"));
    }

    // Solicitudes de un adoptante concreto
    public List<SolicitudAdopcion> findByAdoptante(Long adoptanteId) {
        Usuario actor = authContextService.currentUser();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(adoptanteId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes consultar solicitudes de otro adoptante");
        }
        return solicitudRepository.findByAdoptanteId(adoptanteId);
    }

    // Solicitudes de un animal concreto
    public List<SolicitudAdopcion> findByAnimal(Long animalId) {
        Usuario actor = authContextService.currentUser();
        Animal animal = animalRepository.findById(animalId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Animal no encontrado"));
        Long ownerRefugioId = animal.getRefugio().getId();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(ownerRefugioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes consultar solicitudes de otro refugio");
        }
        return solicitudRepository.findByAnimalId(animalId);
    }

    public SolicitudAdopcion create(Long adoptanteId, Long animalId, 
                                     SolicitudAdopcion solicitud) {
        Usuario actor = authContextService.currentUser();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(adoptanteId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes crear solicitudes para otro usuario");
        }

        // Comprobamos que el adoptante existe y tiene rol ADOPTANTE
        Usuario adoptante = usuarioRepository.findById(adoptanteId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Adoptante no encontrado"));

        if (adoptante.getRol() != Usuario.Rol.ADOPTANTE) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN, "El usuario no es un adoptante");
        }

        // Comprobamos que el animal existe y está disponible
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Animal no encontrado"));

        if (animal.getEstadoAdopcion() != Animal.EstadoAdopcion.DISPONIBLE) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "El animal no está disponible");
        }

        solicitud.setId(null);
        solicitud.setAdoptante(adoptante);
        solicitud.setAnimal(animal);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstadoSolicitud(SolicitudAdopcion.EstadoSolicitud.PENDIENTE);
        return solicitudRepository.save(solicitud);
    }

    // El refugio aprueba o rechaza la solicitud
    public SolicitudAdopcion cambiarEstado(Long id, 
                                            SolicitudAdopcion.EstadoSolicitud nuevoEstado) {
        SolicitudAdopcion existing = findById(id);
        Usuario actor = authContextService.currentUser();
        Long ownerRefugioId = existing.getAnimal().getRefugio().getId();
        if (!authContextService.isAdmin(actor) && !actor.getId().equals(ownerRefugioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo el refugio responsable puede cambiar el estado");
        }
        existing.setEstadoSolicitud(nuevoEstado);

        // Si se aprueba, el animal pasa a ADOPTADO para cerrar el proceso de forma clara.
        if (nuevoEstado == SolicitudAdopcion.EstadoSolicitud.APROBADA) {
            existing.getAnimal().setEstadoAdopcion(Animal.EstadoAdopcion.ADOPTADO);
            animalRepository.save(existing.getAnimal());
        }

        return solicitudRepository.save(existing);
    }

    public void delete(Long id) {
        SolicitudAdopcion existing = findById(id);
        Usuario actor = authContextService.currentUser();
        boolean isOwnerAdoptante = actor.getId().equals(existing.getAdoptante().getId());
        boolean isOwnerRefugio = actor.getId().equals(existing.getAnimal().getRefugio().getId());
        if (!authContextService.isAdmin(actor) && !isOwnerAdoptante && !isOwnerRefugio) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes borrar solicitudes de terceros");
        }
        solicitudRepository.delete(existing);
    }
}