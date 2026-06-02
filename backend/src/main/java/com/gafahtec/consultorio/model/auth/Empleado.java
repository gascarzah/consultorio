package com.gafahtec.consultorio.model.auth;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = { "usuarios", "programacionDetalles" })
@EqualsAndHashCode(exclude = { "usuarios", "programacionDetalles" })
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })

public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEmpleado;
    private String numeroDocumento;
    private String tipoDocumento;
    private String nombres;
    private String apellidoPaterno;
    private String apellidoMaterno;
    private String direccion;
    private String sexo;
    private LocalDateTime fechaIngreso;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime fechaRegistro;

    private String telefono;
    private String celular;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa")
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_empleado")
    private TipoEmpleado tipoEmpleado;

    private Boolean activo;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "empleado", cascade = { CascadeType.ALL }, orphanRemoval = true)
    private Set<Usuario> usuarios = new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "empleado", cascade = { CascadeType.ALL }, orphanRemoval = true)
    private Set<ProgramacionDetalle> programacionDetalles = new HashSet<>();

}
