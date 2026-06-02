package com.gafahtec.consultorio.dto.request;

import java.io.Serializable;

import lombok.Data;

@Data
public class RolMenuRequest implements Serializable {
private Integer idRol;
private Integer[] idsMenu;
}
