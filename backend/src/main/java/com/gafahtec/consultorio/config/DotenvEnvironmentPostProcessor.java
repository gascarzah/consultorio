package com.gafahtec.consultorio.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Carga backend/.env con prioridad sobre variables del IDE/OS (desarrollo local).
 */
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

  private static final String PROPERTY_SOURCE_NAME = "dotenv";

  @Override
  public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
    Path envFile = DotenvLoader.resolveEnvFile();
    if (!Files.isRegularFile(envFile)) {
      return;
    }

    try {
      Map<String, String> loaded = DotenvLoader.loadEnvFile(envFile);
      var properties = new LinkedHashMap<String, Object>();
      loaded.forEach(properties::put);
      if (!properties.isEmpty()) {
        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
      }
    } catch (IOException ex) {
      throw new IllegalStateException("No se pudo leer " + envFile.toAbsolutePath(), ex);
    }
  }
}
