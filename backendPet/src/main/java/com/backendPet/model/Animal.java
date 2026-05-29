package com.backendPet.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "animales")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del animal es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La especie es obligatoria")
    @Pattern(regexp = "Perro|Gato|Conejo|Cobaya|Hamster|Rata|Tortuga|Gallina|Pájaro",
             message = "La especie debe ser: Perro, Gato, Conejo, Cobaya, Hamster, Rata, Tortuga, Gallina o Pájaro")
    @Column(nullable = false)
    private String especie;

    private String raza;
    private Integer edad;
    private String estadoSalud;
    private String ubicacion;

    @Column(length = 1000)
    private String foto;

    private String descripcion;

    @Pattern(regexp = "Macho|Hembra",
             message = "El género debe ser: Macho o Hembra")
    private String genero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAdopcion estadoAdopcion = EstadoAdopcion.DISPONIBLE;

    public enum EstadoAdopcion {
        DISPONIBLE, EN_PROCESO, ADOPTADO
    }

    @JsonIgnoreProperties({"animales", "password", "hibernateLazyInitializer"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refugio_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_animal_refugio"))
    private Usuario refugio;

    public Animal() {}

    public Animal(String nombre, String especie, String raza,
                  Integer edad, String estadoSalud, String ubicacion, String descripcion, String genero) {
        this.nombre = nombre;
        this.especie = especie;
        this.raza = raza;
        this.edad = edad;
        this.estadoSalud = estadoSalud;
        this.ubicacion = ubicacion;
        this.estadoAdopcion = EstadoAdopcion.DISPONIBLE;
        this.descripcion = descripcion;
        this.genero = genero;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }
    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getEstadoSalud() { return estadoSalud; }
    public void setEstadoSalud(String estadoSalud) { this.estadoSalud = estadoSalud; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public EstadoAdopcion getEstadoAdopcion() { return estadoAdopcion; }
    public void setEstadoAdopcion(EstadoAdopcion estadoAdopcion) { this.estadoAdopcion = estadoAdopcion; }
    public Usuario getRefugio() { return refugio; }
    public void setRefugio(Usuario refugio) { this.refugio = refugio; }

    public Long getRefugioId() {
        return refugio != null ? refugio.getId() : null;
    }
}
