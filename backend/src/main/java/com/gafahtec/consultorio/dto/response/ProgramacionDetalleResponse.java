package com.gafahtec.consultorio.dto.response;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.model.consultorio.Programacion;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;

import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProgramacionDetalleResponse implements Serializable {

    
//    
//    private Set<ProgramacionDetalle> programacionDetalles;
//    
//    private  Set< Boolean> listaDias;
    
    
    ///////////////////////////////////
    private Integer idProgramacionDetalle;

    private LocalDate fecha;

    private String diaSemana;
    private Integer numeroDiaSemana;
    
    private Boolean estado;
    private EmpleadoResponse empleado;

    private ProgramacionResponse programacion;
    
    private Integer registrados;
    


    

    
}
