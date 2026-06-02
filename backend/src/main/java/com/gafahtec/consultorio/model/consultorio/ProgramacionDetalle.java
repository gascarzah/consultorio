package com.gafahtec.consultorio.model.consultorio;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gafahtec.consultorio.model.auth.Empleado;
import jakarta.persistence.*;

import lombok.*;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"citas"})
@EqualsAndHashCode(exclude = {"citas", "empleado"})
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProgramacionDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProgramacionDetalle;

    private LocalDate fecha;
    private String diaSemana;
    private Integer numeroDiaSemana;
    private Boolean activo;

    private String strFecha;

    @ManyToOne(fetch = FetchType.LAZY)
    private Empleado empleado;

    @ManyToOne(fetch = FetchType.LAZY) // Cambié a LAZY
    @JoinColumn(name = "id_programacion", nullable = false, foreignKey = @ForeignKey(name = "FK_programacion"))
    private Programacion programacion;

    @JsonIgnore
    @Builder.Default
    @OneToMany(mappedBy = "programacionDetalle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Cambié a LAZY
    private Set<Cita> citas = new HashSet<>();
}
