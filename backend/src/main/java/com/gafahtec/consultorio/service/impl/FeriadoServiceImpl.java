package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.model.Feriado;
import com.gafahtec.consultorio.model.Maestra;
import com.gafahtec.consultorio.repository.IFeriadoRepository;
import com.gafahtec.consultorio.repository.IGenericRepository;
import com.gafahtec.consultorio.repository.IMaestraRepository;
import com.gafahtec.consultorio.service.IFeriadoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class FeriadoServiceImpl extends CRUDImpl<Feriado, Integer> implements IFeriadoService {

    private IFeriadoRepository repo;

    @Override
    protected IGenericRepository<Feriado, Integer> getRepo() {

        return repo;
    }

    @Override
    public List<Feriado> getAll() {
        return repo.findAll();
    }
}
