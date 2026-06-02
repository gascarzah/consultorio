package com.gafahtec.consultorio.model.consultorio;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gafahtec.consultorio.model.auth.Empresa;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.*;

import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"citas"})
@EqualsAndHashCode(exclude = {"citas"})
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HistoriaClinica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idHistoriaClinica;

	private String ectoscopia;
	private String alergia;
	private String motivo;
	private String antecedentesMedicos;

	private String numeroDocumento;

	private String nombres;
	private String apellidoPaterno;
	private String apellidoMaterno;
	private String tipoDocumento;
	private String direccion;
	private String telefono;
	private String celular;
	private String email;

	@Column(nullable = false)
	@Builder.Default
	private Boolean activo = true;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id_empresa")
	private Empresa empresa;

	@JsonIgnore
	@Builder.Default
	@OneToMany(mappedBy = "historiaClinica", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // Cambié a LAZY
	private Set<Cita> citas = new HashSet<>();
}
