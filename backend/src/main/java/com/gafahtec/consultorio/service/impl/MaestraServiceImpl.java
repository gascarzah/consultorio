package com.gafahtec.consultorio.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.model.Maestra;
import com.gafahtec.consultorio.repository.IGenericRepository;
import com.gafahtec.consultorio.repository.IMaestraRepository;
import com.gafahtec.consultorio.service.IMaestraService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
@Transactional
public class MaestraServiceImpl extends CRUDImpl<Maestra, Integer>  implements IMaestraService {

	
	private IMaestraRepository repo;
	
	@Override
	protected IGenericRepository<Maestra, Integer> getRepo() {
		
		return repo;
	}

    @Override
    public Page<Maestra> listarMaestraPageable(Integer idEmpresa,
            Integer idMaestra,Pageable pageable) {
        return repo.listarMaestraPageable( idEmpresa,
                idMaestra,pageable);
    }




}
