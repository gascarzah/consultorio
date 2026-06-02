package com.gafahtec.consultorio.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.model.Maestra;


public interface IMaestraService extends ICRUD2<Maestra,Integer>{
    Page<Maestra> listarMaestraPageable(Integer idEmpresa,
             Integer idMaestra,Pageable pageable);
}
