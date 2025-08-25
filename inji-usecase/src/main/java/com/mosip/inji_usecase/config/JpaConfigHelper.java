package com.mosip.inji_usecase.config;

import javax.sql.DataSource;

import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import jakarta.persistence.EntityManagerFactory;

public class JpaConfigHelper {
        public static LocalContainerEntityManagerFactoryBean createEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            DataSource dataSource,
            String packagesToScan,
            String persistenceUnitName) {

        return builder
                .dataSource(dataSource)
                .packages(packagesToScan)
                .persistenceUnit(persistenceUnitName)
                .build();
    }

    public static PlatformTransactionManager createTransactionManager(
            EntityManagerFactory emf) {
        
        return new JpaTransactionManager(emf);
    }
}
