package com.mosip.inji_usecase.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "entity_data")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EntityData {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private String id;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> data;
}
