package com.backendPet.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Email(message = "El email no es válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(nullable = false, unique = true)
    private String email;

    // @NotBlank(message = "La contraseña es obligatoria")
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
    
    private String descripcion;  // descripción del refugio

    private String foto;         // URL foto del refugio

    private String telefono;
    
    // Para que funcione la clase Animal
    @JsonManagedReference
    @OneToMany(mappedBy = "refugio", cascade = CascadeType.ALL)
    private List<Animal> animales = new ArrayList<>();

    // Aquí se definen los roles de la aplicación
    public enum Rol {
        ADOPTANTE, REFUGIO, ADMIN
    }

    public Usuario() {}

    public Usuario(String nombre, String email, String password, Rol rol, String descripcion, String foto, String telefono) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.descripcion = descripcion;
        this.foto = foto;
        this.telefono = telefono;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}
