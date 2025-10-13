package com.mosip.inji_usecase;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.mosip.inji_usecase.entity.EntityMetadata;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class InjiDataCreationApp {

	public static void main(String[] args) {
		SpringApplication.run(InjiDataCreationApp.class, args);
	}

	@Bean
	public EntityMetadata entityMetadata() throws IOException {
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		ClassPathResource resource = new ClassPathResource("entities.yml");
		Map<String, List<Map<String, Object>>> config = mapper.readValue(resource.getInputStream(), Map.class);
		return new EntityMetadata(config.get("entities"));
	}
}
