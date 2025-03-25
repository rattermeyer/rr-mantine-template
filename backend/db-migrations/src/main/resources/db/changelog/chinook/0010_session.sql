--liquibase formatted sql
--changeset rat:0010-session-1
DROP TABLE IF EXISTS session;
CREATE UNLOGGED TABLE session
(
    id      uuid                     NOT NULL DEFAULT extensions.uuid_generate_v7(),
    data    json                     NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now() + INTERVAL '1 day',
    CONSTRAINT pk_session PRIMARY KEY (id)

);
