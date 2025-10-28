package com.mosip.inji_usecase.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@PropertySource({ "classpath:database.properties" })
@EnableJpaRepositories(
        basePackages="com.mosip.inji_usecase.repository.data",
        entityManagerFactoryRef="entityDataEntityManager",
        transactionManagerRef="entityDataTransactionManager")
public class EntityDataConfiguration {

    @Bean
    @Primary  // Add this
    @ConfigurationProperties(prefix = "spring.entity-datasource")
    public DataSource entityDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary  // Add this
    public LocalContainerEntityManagerFactoryBean entityDataEntityManager(
            @Qualifier("entityDataSource") DataSource dataSource,
            EntityManagerFactoryBuilder builder) {
        return JpaConfigHelper.createEntityManagerFactory(
                builder,
                dataSource,
                "com.mosip.inji_usecase.entity",
                "entityData");
    }

    @Bean
    @Primary  // Add this
    public PlatformTransactionManager entityDataTransactionManager(
            @Qualifier("entityDataEntityManager") EntityManagerFactory emf) {
        return JpaConfigHelper.createTransactionManager(emf);
    }
}
