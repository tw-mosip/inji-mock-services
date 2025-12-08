package com.mosip.inji_usecase.config;

import javax.sql.DataSource;

import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import jakarta.persistence.EntityManagerFactory;

import java.util.HashMap;
import java.util.Map;

public class JpaConfigHelper {
        public static LocalContainerEntityManagerFactoryBean createEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            DataSource dataSource,
            String packagesToScan,
            String persistenceUnitName) {

        Map<String, Object> jpaProperties = new HashMap<>();
        jpaProperties.put("hibernate.hbm2ddl.auto", "none");
        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
        jpaProperties.put("hibernate.format_sql", true);
        jpaProperties.put("hibernate.jdbc.lob.non_contextual_creation", true);

        return builder
                .dataSource(dataSource)
                .packages(packagesToScan)
                .persistenceUnit(persistenceUnitName)
                .properties(jpaProperties)
                .build();
    }

    public static PlatformTransactionManager createTransactionManager(
            EntityManagerFactory emf) {
        
        return new JpaTransactionManager(emf);
    }
}
