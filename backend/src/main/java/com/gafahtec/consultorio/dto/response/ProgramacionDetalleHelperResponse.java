package com.gafahtec.consultorio.dto.response;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import com.gafahtec.consultorio.model.auth.Empleado;
import com.gafahtec.consultorio.model.consultorio.ProgramacionDetalle;

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
public class ProgramacionDetalleHelperResponse implements Serializable {

    private Empleado empleado;
    
    private List<ProgramacionDetalle> programacionDetalles;
    
    private  List< Boolean> listaDias;
    
        
}
