-- Table: farmer.entity_data

-- DROP TABLE IF EXISTS farmer.entity_data;

CREATE TABLE IF NOT EXISTS entity_data
(
    entity_type character varying(255),
    id character varying(255) NOT NULL,
    data jsonb,
    CONSTRAINT entity_data_pkey PRIMARY KEY (id)
)