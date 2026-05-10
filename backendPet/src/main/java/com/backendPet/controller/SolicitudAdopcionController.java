package com.backendPet.controller;

import com.backendPet.model.SolicitudAdopcion;
import com.backendPet.service.SolicitudAdopcionService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081")
public class SolicitudAdopcionController {

    private final SolicitudAdopcionService solicitudService;

    public SolicitudAdopcionController(SolicitudAdopcionService solicitudService) {
        this.solicitudService = solicitudService;
    }

    // -------- CRUD SOLICITUDES --------
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/solicitudes")
    public List<SolicitudAdopcion> listarSolicitudes() {
        return solicitudService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/solicitudes/{id}")
    public SolicitudAdopcion obtenerSolicitud(@PathVariable Long id) {
        return solicitudService.findById(id);
    }

    // Solicitudes de un adoptante concreto
    @GetMapping("/adoptantes/{adoptanteId}/solicitudes")
    public List<SolicitudAdopcion> listarSolicitudesDeAdoptante(
            @PathVariable Long adoptanteId) {
        return solicitudService.findByAdoptante(adoptanteId);
    }

    // Solicitudes de un animal concreto
    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @GetMapping("/animales/{animalId}/solicitudes")
    public List<SolicitudAdopcion> listarSolicitudesDeAnimal(
            @PathVariable Long animalId) {
        return solicitudService.findByAnimal(animalId);
    }

    // Crear solicitud
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('ADMIN')")
    @PostMapping("/adoptantes/{adoptanteId}/animales/{animalId}/solicitudes")
    public SolicitudAdopcion crearSolicitud(
            @PathVariable Long adoptanteId,
            @PathVariable Long animalId,
            @RequestBody SolicitudAdopcion solicitud) {
        solicitud.setId(null);
        return solicitudService.create(adoptanteId, animalId, solicitud);
    }

    // El refugio cambia el estado de la solicitud (APROBADA o RECHAZADA)
    @PreAuthorize("hasRole('REFUGIO') or hasRole('ADMIN')")
    @PutMapping("/solicitudes/{id}/estado")
    public SolicitudAdopcion cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        SolicitudAdopcion.EstadoSolicitud nuevoEstado =
                SolicitudAdopcion.EstadoSolicitud.valueOf(body.get("estadoSolicitud"));
        return solicitudService.cambiarEstado(id, nuevoEstado);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADOPTANTE') or hasRole('REFUGIO') or hasRole('ADMIN')")
    @DeleteMapping("/solicitudes/{id}")
    public void borrarSolicitud(@PathVariable Long id) {
        solicitudService.delete(id);
    }
}