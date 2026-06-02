package com.gafahtec.consultorio.model.consultorio;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
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
@ToString(exclude = { "citas" })
@EqualsAndHashCode(exclude = { "citas" })
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHorario;

    private String descripcion;
    
    private Integer idEmpresa;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "horario", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<Cita> citas = new HashSet<>();
}
