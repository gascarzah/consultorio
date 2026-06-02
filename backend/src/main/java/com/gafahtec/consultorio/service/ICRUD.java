package com.gafahtec.consultorio.service;

import java.util.List;
import java.util.Set;

public interface ICRUD<RQ, RS, ID> {

	RS registrar(RQ request);

	RS modificar(RQ request);

	List<RS> listar();

	RS listarPorId(ID id);

	void eliminar(ID id);
	
	
}
