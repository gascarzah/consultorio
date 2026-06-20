package com.gafahtec.consultorio.config;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.lang.NonNull;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DatabaseConnectionLogger implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

  @Override
  public void onApplicationEvent(@NonNull ApplicationEnvironmentPreparedEvent event) {
    ConfigurableEnvironment env = event.getEnvironment();
    String url = env.getProperty("DB_URL", "(no definido)");
    String user = env.getProperty("DB_USERNAME", "(no definido)");
    String schema = env.getProperty("DB_SCHEMA", "consultorio");
    log.info("Conexión BD configurada: user={} schema={} url={}", user, schema, url);
  }
}
