package com.gafahtec.consultorio.model.consultorio;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import lombok.*;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCita;

    @ManyToOne(fetch = FetchType.LAZY) // Cambié EAGER a LAZY para optimizar rendimiento
    @JoinColumn(name = "historia_clinica", nullable = true, foreignKey = @ForeignKey(name = "FK_cita_cliente"))
    private HistoriaClinica historiaClinica;

    @ManyToOne(fetch = FetchType.LAZY) // Cambié EAGER a LAZY para optimizar rendimiento
    @JoinColumn(name = "id_horario", nullable = true, foreignKey = @ForeignKey(name = "FK_cita_horario"))
    private Horario horario;

    @ManyToOne(fetch = FetchType.LAZY) // Cambié EAGER a LAZY para optimizar rendimiento
    @JoinColumn(name = "id_programacion_detalle", nullable = true, foreignKey = @ForeignKey(name = "FK_cita_programaciondet"))
    private ProgramacionDetalle programacionDetalle;

    private Boolean atendido;

    private String informe;

    /** Motivo y diagnóstico capturados al registrar la consulta (además del informe / dictado). */
    @Column(length = 4000)
    private String motivo;

    @Column(length = 4000)
    private String diagnostico;

    private Integer estado;
}
