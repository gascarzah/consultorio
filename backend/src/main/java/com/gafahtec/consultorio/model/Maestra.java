package com.gafahtec.consultorio.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Setter
@Getter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Maestra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMaestra;

    private Integer idMaestraPadre;

    private Integer idEmpresa;

    private String descripcion;
    
    private Boolean estado;
}
