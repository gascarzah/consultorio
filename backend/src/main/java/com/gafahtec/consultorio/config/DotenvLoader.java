package com.gafahtec.consultorio.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Carga backend/.env antes de Spring (IDE) y para el EnvironmentPostProcessor.
 */
public final class DotenvLoader {

  private DotenvLoader() {}

  public static Path resolveEnvFile() {
    Path cwd = Path.of("").toAbsolutePath();
    Path inCwd = cwd.resolve(".env");
    if (Files.isRegularFile(inCwd)) {
      return inCwd;
    }
    Path inBackend = cwd.resolve("backend").resolve(".env");
    if (Files.isRegularFile(inBackend)) {
      return inBackend;
    }
    return inCwd;
  }

  public static Map<String, String> loadEnvFile(Path envFile) throws IOException {
    if (!Files.isRegularFile(envFile)) {
      return Map.of();
    }
    List<String> lines = Files.readAllLines(envFile);
    Map<String, String> properties = new LinkedHashMap<>();
    for (String line : lines) {
      String trimmed = line.trim();
      if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
        continue;
      }
      int idx = trimmed.indexOf('=');
      String key = trimmed.substring(0, idx).trim();
      String value = stripQuotes(trimmed.substring(idx + 1).trim());
      properties.put(key, value);
    }
  applyDatabaseUrl(properties);
    return properties;
  }

  /** Carga .env en System properties (prioridad para arranque desde IDE). */
  public static void loadIntoSystemProperties() {
    try {
      Path envFile = resolveEnvFile();
      if (!Files.isRegularFile(envFile)) {
        return;
      }
      Map<String, String> properties = loadEnvFile(envFile);
      properties.forEach((key, value) -> System.setProperty(key, value));
    } catch (IOException ex) {
      throw new IllegalStateException("No se pudo leer " + resolveEnvFile().toAbsolutePath(), ex);
    }
  }

  static void applyDatabaseUrl(Map<String, String> properties) {
    String url = properties.get("DATABASE_URL");
    if (url == null || !url.startsWith("postgresql://")) {
      return;
    }

    String withoutScheme = url.substring("postgresql://".length());
    int at = withoutScheme.lastIndexOf('@');
    if (at < 0) {
      return;
    }

    String userPass = withoutScheme.substring(0, at);
    String hostDb = withoutScheme.substring(at + 1);

    int colon = userPass.indexOf(':');
    String user = colon >= 0 ? userPass.substring(0, colon) : userPass;
    String pass = colon >= 0 ? userPass.substring(colon + 1) : "";

    int slash = hostDb.indexOf('/');
    String hostPort = slash >= 0 ? hostDb.substring(0, slash) : hostDb;
    String database = slash >= 0 ? hostDb.substring(slash + 1) : "";
    int query = database.indexOf('?');
    if (query >= 0) {
      database = database.substring(0, query);
    }

    int portColon = hostPort.lastIndexOf(':');
    String host = portColon >= 0 ? hostPort.substring(0, portColon) : hostPort;
    String port = portColon >= 0 ? hostPort.substring(portColon + 1) : "5432";

    properties.put("DB_URL", "jdbc:postgresql://" + host + ":" + port + "/" + database);
    properties.put("DB_USERNAME", user);
    properties.put("DB_PASSWORD", pass);
  }

  private static String stripQuotes(String value) {
    if (value.length() >= 2
        && ((value.startsWith("\"") && value.endsWith("\""))
            || (value.startsWith("'") && value.endsWith("'")))) {
      return value.substring(1, value.length() - 1);
    }
    return value;
  }
}
