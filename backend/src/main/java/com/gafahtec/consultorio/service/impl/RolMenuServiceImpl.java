package com.gafahtec.consultorio.service.impl;

import com.gafahtec.consultorio.dto.request.RolMenuRequest;
import com.gafahtec.consultorio.dto.response.MenusPorRolResponse;
import com.gafahtec.consultorio.dto.response.RolMenuResponse;
import com.gafahtec.consultorio.model.auth.Menu;
import com.gafahtec.consultorio.model.auth.Rol;
import com.gafahtec.consultorio.model.auth.RolMenu;
import com.gafahtec.consultorio.model.auth.RolMenuPK;
import com.gafahtec.consultorio.repository.IMenuRepository;
import com.gafahtec.consultorio.repository.IRolRepository;
import com.gafahtec.consultorio.repository.IRolMenuRepository;
import com.gafahtec.consultorio.service.IRolMenuService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@AllArgsConstructor
@Service
@Transactional
@Slf4j
public class RolMenuServiceImpl  implements IRolMenuService {

	
	private IRolMenuRepository iRolMenuRepository;
	private IMenuRepository iMenuRepository;
	private IRolRepository iRolRepository;

	@Override
	public RolMenuResponse registrar(RolMenuRequest request) {
		if (request.getIdRol() == null || request.getIdsMenu() == null) {
			throw new IllegalArgumentException("El id del rol y la lista de menus son obligatorios.");
		}

		List<RolMenu> listaActual = iRolMenuRepository.findByRolOrder(request.getIdRol());
		List<Integer> nuevosIdsMenu   = Arrays.asList( request.getIdsMenu());


		List<Integer> idsMenusActuales = listaActual.stream()
				.map(rolMenu -> rolMenu.getMenu().getIdMenu())
				.toList();


		// **1. Eliminar los menús que ya no están en la nueva lista**
		listaActual.forEach(rolMenu -> {
			if (!nuevosIdsMenu.contains(rolMenu.getMenu().getIdMenu())) {
				iRolMenuRepository.delete(rolMenu);
			}
		});

		// **2. Insertar solo los nuevos menús que no existen**
		nuevosIdsMenu.forEach(idMenu -> {
			if (!idsMenusActuales.contains(idMenu)) {
				iRolMenuRepository.save(RolMenu.builder()
						.rol(Rol.builder().idRol(request.getIdRol()).build())
						.menu(Menu.builder().idMenu(idMenu).build())
						.build());
			}
		});

		var response = new RolMenuResponse();
		response.setRol(iRolRepository.findById(request.getIdRol())
				.orElse(Rol.builder().idRol(request.getIdRol()).build()));
		if (request.getIdsMenu().length > 0) {
			Integer firstMenuId = request.getIdsMenu()[0];
			response.setMenu(iMenuRepository.findById(firstMenuId)
					.orElse(Menu.builder().idMenu(firstMenuId).build()));
		}
		return response;
	}


	
	private RolMenuResponse entityToResponse(RolMenu entity) {
		var response = new RolMenuResponse();
		var rol = new Rol();
		BeanUtils.copyProperties(entity.getRol(),rol );
		var menu = new Menu();
		BeanUtils.copyProperties(entity.getMenu(),menu );
		response.setMenu(menu);
		response.setRol(rol);
		return response;
	}



	@Override
	public RolMenuResponse modificar(RolMenuRequest request) {
		return registrar(request);
	}



	@Override
	public List<RolMenuResponse> listar() {
		return iRolMenuRepository.findAll().stream()
				.map(this::entityToResponse)
				.toList();
	}



	@Override
	public RolMenuResponse listarPorId(RolMenuPK id) {
		return iRolMenuRepository.findById(id)
				.map(this::entityToResponse)
				.orElseThrow(() -> new EntityNotFoundException("Relacion rol-menu no encontrada"));
	}



	@Override
	public void eliminar(RolMenuPK id) {
		if (!iRolMenuRepository.existsById(id)) {
			throw new EntityNotFoundException("Relacion rol-menu no encontrada");
		}
		iRolMenuRepository.deleteById(id);
	}



	@Override
	public Page<RolMenuResponse> listarPageable(Integer idRol, Pageable pageable) {
		
		 return iRolMenuRepository.listarPageable(idRol,pageable).map(this::entityToResponse);
	}



	@Override
	public List<MenusPorRolResponse> listarPorId(Integer id) {
		List<Menu> menus = iMenuRepository.findAll()
				.stream()
				.filter(menu -> Boolean.TRUE.equals(menu.getActivo()))
				.sorted(Comparator
						.comparing((Menu menu) -> Optional.ofNullable(menu.getOrden()).orElse(Integer.MAX_VALUE))
						.thenComparing(Menu::getNombre, String.CASE_INSENSITIVE_ORDER))
				.toList();

		if (isSuperRole(id)) {
			return menus.stream()
					.map(menu -> MenusPorRolResponse.builder()
							.idMenu(menu.getIdMenu())
							.nombre(menu.getNombre())
							.path(menu.getPath())
							.idCategoria(menu.getCategoria() != null ? menu.getCategoria().getIdCategoria() : null)
							.categoriaNombre(menu.getCategoria() != null ? menu.getCategoria().getNombre() : null)
							.orden(menu.getOrden())
							.activo(true)
							.build())
					.toList();
		}

		List<RolMenu> lista = iRolMenuRepository.findByRolOrder(id);

		List<MenusPorRolResponse> filteredMenus = menus.stream()
				.map(menu -> {

					RolMenu rolMenu = lista.stream()
							.filter(rm -> rm.getMenu().getIdMenu().equals(menu.getIdMenu()))
							.findFirst()
							.orElse(null);


					return MenusPorRolResponse.builder()
							.idMenu(menu.getIdMenu())
							.nombre(menu.getNombre())
							.path(menu.getPath())
							.idCategoria(menu.getCategoria() != null ? menu.getCategoria().getIdCategoria() : null)
							.categoriaNombre(menu.getCategoria() != null ? menu.getCategoria().getNombre() : null)
							.orden(menu.getOrden())
							.activo(rolMenu != null)
							.build();
				})
				.toList();

		// Loguea el resultado para comprobar que todo está funcionando correctamente
		log.info("lista ===> {}", filteredMenus);

		return filteredMenus;
	}

	public List<RolMenuResponse> listarRolPorMenus(Integer id) {
		if (isSuperRole(id)) {
			return iMenuRepository.findAll()
					.stream()
					.filter(menu -> Boolean.TRUE.equals(menu.getActivo()))
					.map(menu -> {
						var response = new RolMenuResponse();
						response.setRol(Rol.builder().idRol(id).nombre("SUPER").build());
						response.setMenu(menu);
						return response;
					})
					.toList();
		}

		return iRolMenuRepository.findByRolMenu(id).stream().map(this::entityToResponse).toList();


	}

	private boolean isSuperRole(Integer idRol) {
		return iRolRepository.findById(idRol)
				.map(rol -> "SUPER".equalsIgnoreCase(rol.getNombre()))
				.orElse(false);
	}
}
