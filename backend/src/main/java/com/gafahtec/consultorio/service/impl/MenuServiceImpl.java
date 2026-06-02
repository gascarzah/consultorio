package com.gafahtec.consultorio.service.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gafahtec.consultorio.dto.request.MenuRequest;
import com.gafahtec.consultorio.dto.response.MenuResponse;
import com.gafahtec.consultorio.model.auth.CategoriaMenu;
import com.gafahtec.consultorio.model.auth.Menu;
import com.gafahtec.consultorio.repository.ICategoriaMenuRepository;
import com.gafahtec.consultorio.repository.IMenuRepository;
import com.gafahtec.consultorio.service.IMenuService;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

@AllArgsConstructor
@Service
@Transactional
@Log4j2
public class MenuServiceImpl implements IMenuService {

	private IMenuRepository iMenuRepository;
	private ICategoriaMenuRepository iCategoriaMenuRepository;

	@Override
	public Page<MenuResponse> listarPageable(Pageable pageable) {
		return iMenuRepository.findByActivoTrue(pageable)
				.map(this::entityToResponse);
	}

	@Override
	public Page<MenuResponse> buscarMenus(String search, Pageable pageable) {
		Page<Menu> menus = iMenuRepository.buscarMenus(search, pageable);
		return menus.map(this::entityToResponse);
	}

	@Override
	public MenuResponse registrar(MenuRequest request) {
		var menu = Menu.builder()
				.idMenu(request.getIdMenu())
				.nombre(request.getNombre())
				.path(request.getPath())
				.orden(request.getOrden())
				.activo(request.getActivo())
				.categoria(resolveCategoria(request.getIdCategoria()))
				.build();
		var obj = iMenuRepository.save(menu);

		log.info("objeto creado {}", obj);
		return entityToResponse(obj);
	}

	@Override
	public MenuResponse modificar(MenuRequest request) {
		var menu = Menu.builder()
				.idMenu(request.getIdMenu())
				.nombre(request.getNombre())
				.path(request.getPath())
				.orden(request.getOrden())
				.activo(request.getActivo())
				.categoria(resolveCategoria(request.getIdCategoria()))
				.build();
		var obj = iMenuRepository.save(menu);
		return entityToResponse(obj);
	}

	@Override
	public List<MenuResponse> listar() {

		return iMenuRepository.findByActivoTrue(Pageable.unpaged()).stream().map(this::entityToResponse).toList();
	}

	@Override
	public MenuResponse listarPorId(Integer id) {
		return entityToResponse(iMenuRepository.findById(id)
				.filter(Menu::getActivo)
				.orElseThrow(() -> new IllegalArgumentException("Menu no encontrado: " + id)));
	}

	@Override
	public void eliminar(Integer id) {
		var menu = iMenuRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Menu no encontrado: " + id));
		menu.setActivo(Boolean.FALSE);
		iMenuRepository.save(menu);
	}

	private MenuResponse entityToResponse(Menu entity) {
		var response = new MenuResponse();
		BeanUtils.copyProperties(entity, response);
		response.setIdCategoria(entity.getCategoria() != null ? entity.getCategoria().getIdCategoria() : null);
		response.setCategoriaNombre(entity.getCategoria() != null ? entity.getCategoria().getNombre() : null);
		return response;
	}

	private CategoriaMenu resolveCategoria(Integer idCategoria) {
		if (idCategoria == null) {
			return null;
		}
		return iCategoriaMenuRepository.findById(idCategoria)
				.orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + idCategoria));
	}

}
