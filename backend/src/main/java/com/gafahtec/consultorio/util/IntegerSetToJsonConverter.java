package com.gafahtec.consultorio.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.log4j.Log4j2;

import java.io.IOException;
import java.util.Set;

@Converter
@Log4j2
public class IntegerSetToJsonConverter implements AttributeConverter<Set<Integer>, String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Set<Integer> attribute) {
        try {
            return mapper.writeValueAsString(attribute);  // Esto genera un array JSON
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error serializing Set<Integer>", e);
        }
    }

    @Override
    public Set<Integer> convertToEntityAttribute(String dbData) {
        try {
            return mapper.readValue(dbData, new TypeReference<Set<Integer>>() {});
        } catch (IOException e) {
            throw new IllegalArgumentException("Error deserializing Set<Integer>", e);
        }
    }
}
