-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_certify
-- Table Name   : entity_data
-- Schema       : certify
-- Purpose      : Stores structured entity-related data as JSONB, typed by entity_type.

CREATE TABLE certify.entity_data (
    id character varying(255) NOT NULL,               -- Primary key for the entity
    entity_type character varying(255),               -- Type/classification of the entity
    data jsonb,                                       -- JSONB-formatted data

    created_at timestamp DEFAULT now(),               -- Timestamp when the record was created
    updated_at timestamp DEFAULT now(),               -- Timestamp of the most recent update

    is_deleted boolean DEFAULT FALSE,                 -- Flag for soft deletion
    deleted_at timestamp,                             -- Timestamp when the record was soft deleted

    CONSTRAINT pk_entity_data_id PRIMARY KEY (id)
);

COMMENT ON TABLE certify.entity_data IS 'Entity Data: Stores structured data in JSONB format for various entity types';

COMMENT ON COLUMN certify.entity_data.id IS 'Entity ID: Unique identifier for the entity record';
COMMENT ON COLUMN certify.entity_data.entity_type IS 'Entity Type: Type/classification of the entity (e.g., farmer, organization)';
COMMENT ON COLUMN certify.entity_data.data IS 'Entity Data: JSONB-formatted dynamic data for the given entity';

COMMENT ON COLUMN certify.entity_data.created_at IS 'Created At: Timestamp when the record was created';
COMMENT ON COLUMN certify.entity_data.updated_at IS 'Updated At: Timestamp of the most recent update';

COMMENT ON COLUMN certify.entity_data.is_deleted IS 'Is Deleted: Soft-delete flag (TRUE if the record is logically deleted)';
COMMENT ON COLUMN certify.entity_data.deleted_at IS 'Deleted At: Timestamp when the record was soft deleted';
