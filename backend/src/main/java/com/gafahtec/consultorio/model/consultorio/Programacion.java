package com.gafahtec.consultorio.model.consultorio;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"programacionDetalles"})
@ToString(exclude = {"programacionDetalles"})
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Programacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idProgramacion;

	private Date fechaInicial;
	private Date fechaFinal;
	private String strFechaInicial;
	private String strFechaFinal;
	private String rango;
	private Boolean activo;
	private Integer idEmpresa;
	private Integer numeroSemana;
	@JsonIgnore
	@Builder.Default
	@OneToMany(mappedBy = "programacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Cambié a LAZY
	private Set<ProgramacionDetalle> programacionDetalles = new HashSet<>();
}
