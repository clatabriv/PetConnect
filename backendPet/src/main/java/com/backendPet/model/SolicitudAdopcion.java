package com.backendPet.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes_adopcion")
public class SolicitudAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fecha de la solicitud, se pone automáticamente
    @Column(nullable = false)
    private LocalDateTime fechaSolicitud;

    private String mensaje; // Mensaje del adoptante al refugio

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSolicitud estadoSolicitud;

    public enum EstadoSolicitud {
        PENDIENTE, APROBADA, RECHAZADA
    }

    // Relación N-1: Muchas solicitudes pueden ser de un mismo adoptante
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adoptante_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_solicitud_adoptante"))
    private Usuario adoptante;

    // Relación N-1: Muchas solicitudes pueden ser para un mismo animal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "animal_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_solicitud_animal"))
    private Animal animal;

    public SolicitudAdopcion() {}

    public SolicitudAdopcion(String mensaje) {
        this.mensaje = mensaje;
        this.fechaSolicitud = LocalDateTime.now();
        this.estadoSolicitud = EstadoSolicitud.PENDIENTE;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }
    public Usuario getAdoptante() { return adoptante; }
    public void setAdoptante(Usuario adoptante) { this.adoptante = adoptante; }
    public Animal getAnimal() { return animal; }
    public void setAnimal(Animal animal) { this.animal = animal; }
}