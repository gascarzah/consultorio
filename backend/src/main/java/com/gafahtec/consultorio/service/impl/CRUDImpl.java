package com.gafahtec.consultorio.service.impl;
import java.util.List;

import com.gafahtec.consultorio.repository.IGenericRepository;
import com.gafahtec.consultorio.service.ICRUD;
import com.gafahtec.consultorio.service.ICRUD2;

public abstract class CRUDImpl<T, ID> implements ICRUD2<T, ID> {

	protected abstract IGenericRepository<T, ID> getRepo();

	@Override
	public T registrar(T t)  {
		return getRepo().save(t);
	}

	@Override
	public T modificar(T t)  {
		return getRepo().save(t);
	}

	@Override
	public List<T> listar()  {
		return getRepo().findAll();
	}

	@Override
	public T listarPorId(ID id)  {
		return getRepo().findById(id).orElse(null);
	}

	@Override
	public void eliminar(ID id)  {
		getRepo().deleteById(id);
	}

}
