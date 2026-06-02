package com.gafahtec.consultorio.validators;

import com.gafahtec.consultorio.annotations.UniqueEmail;
import com.gafahtec.consultorio.repository.IUsuarioRepository;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {


	IUsuarioRepository iUsuarioRepository;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        var usuario = iUsuarioRepository.findByEmail(value);
        if (usuario == null) {
            return true;
        }
        return false;
    }

}
