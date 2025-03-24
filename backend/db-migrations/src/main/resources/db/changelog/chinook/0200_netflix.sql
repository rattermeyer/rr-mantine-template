--liquibase formatted sql
--changeset rat:0200-netflix-1
ALTER TABLE chinook.netflix
    ADD COLUMN global_text TEXT GENERATED ALWAYS AS (coalesce(title,'') || ' ' || coalesce(director,'') || ' ' || coalesce(casts, '') || ' ' || coalesce(country,'') || ' ' || coalesce(description,'')) STORED;
