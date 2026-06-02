package com.gafahtec.consultorio.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.gafahtec.consultorio.model.Maestra;

@Repository
public interface IMaestraRepository extends IGenericRepository<Maestra,Integer>{
    @Query("Select p from Maestra p where p.idEmpresa = :idEmpresa and p.idMaestraPadre = :idMaestra and p.estado = true " )
    Page<Maestra> listarMaestraPageable(Integer idEmpresa, Integer idMaestra, Pageable pageable);
}
