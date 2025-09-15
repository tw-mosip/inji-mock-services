-- Table: farmer.generic_entities

-- DROP TABLE IF EXISTS farmer.generic_entities;

CREATE TABLE IF NOT EXISTS generic_entities
(
    entity_type character varying(255),
    id character varying(255) NOT NULL,
    data jsonb,
    CONSTRAINT generic_entities_pkey PRIMARY KEY (id)
)