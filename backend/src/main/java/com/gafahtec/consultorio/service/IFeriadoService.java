package com.gafahtec.consultorio.service;

import com.gafahtec.consultorio.model.Feriado;

import java.util.List;


public interface IFeriadoService extends ICRUD2<Feriado,Integer>{
    List<Feriado> getAll();
}
