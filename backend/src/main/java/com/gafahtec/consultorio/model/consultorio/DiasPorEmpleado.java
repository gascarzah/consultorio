package com.gafahtec.consultorio.model.consultorio;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.util.IntegerSetToJsonConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DiasPorEmpleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empleado", nullable = false)
    private Empleado empleado;

    @Convert(converter = IntegerSetToJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private Set<Integer> dias;
}
