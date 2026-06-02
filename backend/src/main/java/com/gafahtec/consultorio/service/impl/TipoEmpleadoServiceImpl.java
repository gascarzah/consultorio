package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import com.gafahtec.consultorio.dto.request.TipoEmpleadoRequest;
import com.gafahtec.consultorio.dto.response.TipoEmpleadoResponse;
import com.gafahtec.consultorio.model.auth.TipoEmpleado;
import com.gafahtec.consultorio.repository.ITipoEmpleadoRepository;
import com.gafahtec.consultorio.service.ITipoEmpleadoService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class TipoEmpleadoServiceImpl implements ITipoEmpleadoService {

    @Autowired
    private ITipoEmpleadoRepository iTipoEmpleadoRepository;

    @Override
    public TipoEmpleadoResponse registrar(TipoEmpleadoRequest request) {
        var obj = iTipoEmpleadoRepository.save(TipoEmpleado.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build());
        return entityToResponse(obj);
    }

    @Override
    public TipoEmpleadoResponse modificar(TipoEmpleadoRequest request) {
        var obj = iTipoEmpleadoRepository.save(TipoEmpleado.builder()
                .idTipoEmpleado(request.getIdTipoEmpleado())
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .activo(request.getActivo())
                .build());
        return entityToResponse(obj);
    }

    @Override
    public List<TipoEmpleadoResponse> listar() {
        return iTipoEmpleadoRepository.findByActivoTrue()
                .stream()
                .map(this::entityToResponse)
                .toList();
    }

    @Override
    public TipoEmpleadoResponse listarPorId(Integer id) {
        var tipoEmpleado = iTipoEmpleadoRepository.findById(id)
                .filter(TipoEmpleado::getActivo)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de empleado no encontrado con ID: " + id));
        return entityToResponse(tipoEmpleado);
    }

    @Override
    public void eliminar(Integer id) {
        var tipoEmpleado = iTipoEmpleadoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tipo de empleado no encontrado con ID: " + id));
        tipoEmpleado.setActivo(Boolean.FALSE);
        iTipoEmpleadoRepository.save(tipoEmpleado);
    }

    @Override
    public Page<TipoEmpleadoResponse> listarPageable(Pageable pageable) {
        return iTipoEmpleadoRepository.findByActivoTrue(pageable).map(this::entityToResponse);
    }

    @Override
    public Page<TipoEmpleadoResponse> buscarTiposEmpleado(String search, Pageable pageable) {
        Page<TipoEmpleado> tipos = iTipoEmpleadoRepository.buscarTiposEmpleado(search, pageable);
        return tipos.map(this::entityToResponse);
    }

    private TipoEmpleadoResponse entityToResponse(TipoEmpleado entity) {
        var response = new TipoEmpleadoResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}
