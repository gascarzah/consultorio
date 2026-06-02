package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.model.consultorio.DiasPorEmpleado;
import com.gafahtec.consultorio.repository.IDiasPorEmpleadoRepository;
import com.gafahtec.consultorio.service.DiasPorEmpleadoService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class DiasPorEmpleadoServiceImpl implements DiasPorEmpleadoService {

    private final IDiasPorEmpleadoRepository iDiasPorEmpleadoRepository;

    @Override
    public DiasPorEmpleado guardar(DiasPorEmpleado diasPorEmpleado) {
        return iDiasPorEmpleadoRepository.save(diasPorEmpleado);
    }

    @Override
    public List<DiasPorEmpleado> listarPorEmpleado(Integer idEmpleado) {
        return iDiasPorEmpleadoRepository.findByEmpleadoIdEmpleado(idEmpleado);
    }

    @Override
    public List<DiasPorEmpleado> empleadosPorEmpresa(Integer idEmpresa) {
        return iDiasPorEmpleadoRepository.findByEmpresa(idEmpresa);
    }
}
