package com.mosip.inji_usecase.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import jakarta.persistence.EntityManagerFactory;

@Configuration
@PropertySource({ "classpath:database.properties" })
@EnableJpaRepositories(
        basePackages="com.mosip.inji_usecase.repository.truckpass",
        entityManagerFactoryRef="truckpassEntityManager",
        transactionManagerRef="truckpassTransactionManager")
public class TruckPassConfiguration {

    @Bean
    @ConfigurationProperties(prefix = "spring.truckpass-datasource")
    public DataSource truckpassDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean truckpassEntityManager(
            @Qualifier("truckpassDataSource") DataSource dataSource,
            EntityManagerFactoryBuilder builder) {
        return JpaConfigHelper.createEntityManagerFactory(
                builder,
                dataSource,
                "com.mosip.inji_usecase.entity.truckpass",
                "truckpass");
    }

    @Bean
    public PlatformTransactionManager truckpassTransactionManager(
            @Qualifier("truckpassEntityManager") EntityManagerFactory emf) {
        return JpaConfigHelper.createTransactionManager(emf);
    }
}
