package com.gafahtec.consultorio.service;

import java.util.List;
import java.util.Set;

import com.gafahtec.consultorio.dto.response.MenusPorRolResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gafahtec.consultorio.dto.request.RolMenuRequest;
import com.gafahtec.consultorio.dto.response.RolMenuResponse;
import com.gafahtec.consultorio.model.auth.RolMenuPK;

public interface IRolMenuService extends ICRUD<RolMenuRequest, RolMenuResponse , RolMenuPK>{


	Page<RolMenuResponse> listarPageable(Integer idRol, Pageable paging);

	List<MenusPorRolResponse> listarPorId(Integer id);


	List<RolMenuResponse> listarRolPorMenus(Integer id);
//    Page<RolResponse> listarPageable(Pageable pageable);

}
