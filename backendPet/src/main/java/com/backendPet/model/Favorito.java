package com.backendPet.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;

/**
 * Relacion entre un adoptante y un animal marcado como favorito.
 * Se restringe a un favorito unico por par (adoptante, animal).
 */
@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_favorito_adoptante_animal",
        columnNames = {"adoptante_id", "animal_id"}
    )
)
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "adoptante_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_favorito_adoptante")
    )
    private Usuario adoptante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "animal_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_favorito_animal")
    )
    private Animal animal;

    @Column(nullable = false)
    private LocalDateTime fechaAlta = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getAdoptante() {
        return adoptante;
    }

    public void setAdoptante(Usuario adoptante) {
        this.adoptante = adoptante;
    }

    public Animal getAnimal() {
        return animal;
    }

    public void setAnimal(Animal animal) {
        this.animal = animal;
    }

    public LocalDateTime getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(LocalDateTime fechaAlta) {
        this.fechaAlta = fechaAlta;
    }
}
