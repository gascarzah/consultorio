package com.gafahtec.consultorio.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter

@Getter

@AllArgsConstructor

@NoArgsConstructor

@ToString
public class ErrorMessage {
    private Date timestamp;

    private String message;

    private int status;
    private String description;
}
