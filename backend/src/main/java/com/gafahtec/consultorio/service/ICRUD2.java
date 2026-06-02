package com.gafahtec.consultorio.service;

import java.util.List;

public interface ICRUD2<T, ID> {

	T registrar(T t); 

	T modificar(T t) ;

	List<T> listar() ;

	T listarPorId(ID id) ;

	void eliminar(ID id) ;
	
	
}
