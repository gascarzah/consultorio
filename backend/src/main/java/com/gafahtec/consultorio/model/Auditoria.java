package com.gafahtec.consultorio.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@MappedSuperclass
public class Auditoria {


    @Column( updatable = false, nullable = false)
    @CreatedDate
    private LocalDateTime fechaCreacion;


    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    @CreatedBy
    @Column(updatable = false, nullable = false)
    private String creadoPor;

    @LastModifiedBy
    private String modificadoPor;
    

}
