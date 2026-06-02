package com.gafahtec.consultorio.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {

  /**
   * Orígenes permitidos separados por coma.
   * Ejemplo: https://app.ejemplo.com,http://localhost:5173
   */
  private String allowedOrigins =
      "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173";

  public List<String> getAllowedOriginsList() {
    return Arrays.stream(allowedOrigins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isEmpty())
        .collect(Collectors.toList());
  }
}
