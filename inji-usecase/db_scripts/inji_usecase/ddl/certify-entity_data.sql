-- This Source Code Form is subject to the terms of the Mozilla Public
-- License, v. 2.0. If a copy of the MPL was not distributed with this
-- file, You can obtain one at https://mozilla.org/MPL/2.0/.
-- -------------------------------------------------------------------------------------------------
-- Database Name: inji_certify
-- Table Name   : entity_data
-- Schema       : certify
-- Purpose      : Stores structured entity-related data as JSONB, typed by entity_type.

CREATE TABLE entity_data (
    id character varying(255) NOT NULL,
    entity_type character varying(255),
    data jsonb,

    cr_by character varying(256),
    cr_dtimes timestamp,
    upd_by character varying(256),
    upd_dtimes timestamp,
    is_deleted boolean DEFAULT FALSE,
    del_dtimes timestamp,

    CONSTRAINT pk_entity_data_id PRIMARY KEY (id)
);

COMMENT ON TABLE certify.entity_data IS 'Entity Data: Stores structured data in JSONB format for various entity types';

COMMENT ON COLUMN certify.entity_data.id IS 'Entity ID: Unique identifier for the entity record';
COMMENT ON COLUMN certify.entity_data.entity_type IS 'Entity Type: Type/classification of the entity (e.g., farmer, organization)';
COMMENT ON COLUMN certify.entity_data.data IS 'Entity Data: JSONB-formatted dynamic data for the given entity';

COMMENT ON COLUMN certify.entity_data.cr_by IS 'Created By: ID or name of the user who created the record';
COMMENT ON COLUMN certify.entity_data.cr_dtimes IS 'Created DateTimestamp: Date and time when the record was created';
COMMENT ON COLUMN certify.entity_data.upd_by IS 'Updated By: ID or name of the user who last updated the record';
COMMENT ON COLUMN certify.entity_data.upd_dtimes IS 'Updated DateTimestamp: Date and time of the most recent update';
COMMENT ON COLUMN certify.entity_data.is_deleted IS 'Is Deleted: Soft-delete flag (TRUE if record is logically deleted)';
COMMENT ON COLUMN certify.entity_data.del_dtimes IS 'Deleted DateTimestamp: Timestamp when the record was soft deleted';