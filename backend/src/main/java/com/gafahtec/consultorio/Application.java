package com.gafahtec.consultorio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.gafahtec.consultorio.config.CorsProperties;
import com.gafahtec.consultorio.config.DotenvLoader;

@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		// Prioridad sobre Run Configuration del IDE (IntelliJ/Cursor)
		DotenvLoader.loadIntoSystemProperties();
		SpringApplication.run(Application.class, args);
	}

}
