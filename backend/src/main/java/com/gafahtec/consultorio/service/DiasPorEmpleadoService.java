package com.gafahtec.consultorio.service;

import com.gafahtec.consultorio.model.consultorio.DiasPorEmpleado;

import java.util.List;

public interface DiasPorEmpleadoService {
    DiasPorEmpleado guardar(DiasPorEmpleado diasPorEmpleado);
    List<DiasPorEmpleado> listarPorEmpleado(Integer idEmpleado);

    List<DiasPorEmpleado> empleadosPorEmpresa(Integer idEmpresa);
}
