--liquibase formatted sql
--changeset rat:0100-authnz-1
CREATE TABLE account
(
    uuid           uuid PRIMARY KEY NOT NULL DEFAULT extensions.uuid_generate_v7(),
    email          VARCHAR(254)     NOT NULL,
    name           VARCHAR(100)     NOT NULL,
    password_hash  VARCHAR(128)     NOT NULL,
    email_verified BOOLEAN          NOT NULL DEFAULT FALSE,
    preferences    jsonb            NOT NULL DEFAULT '{}',
    CONSTRAINT uq_benutzer_email UNIQUE (email)
);

--changeset rat:0100-authnz-2
CREATE TABLE role
(
    uuid uuid PRIMARY KEY NOT NULL DEFAULT extensions.uuid_generate_v7(),
    name VARCHAR(40)      NOT NULL,
    CONSTRAINT uq_rolle_name UNIQUE (name)
);

--changeset rat:0100-authnz-3
CREATE TABLE account_role
(
    account_uuid uuid NOT NULL,
    role_uuid    uuid NOT NULL,
    CONSTRAINT pk_benutzer_rolle PRIMARY KEY (account_uuid, role_uuid),
    CONSTRAINT fk_benutzer_rolle_benutzer FOREIGN KEY (account_uuid) REFERENCES account (uuid),
    CONSTRAINT fk_benutzer_rolle_rolle FOREIGN KEY (role_uuid) REFERENCES role (uuid)
);

--changeset rat:0100-authnz-4 runOnChange: true
INSERT INTO role (uuid, name)
VALUES ('01920bef-9e70-7489-9ced-61c6bc9f1f27', 'ADMIN'),
       ('01922564-cb31-7a45-ab08-40560aedd97b', 'USER')
       ON CONFLICT DO NOTHING;

--changeset rat:0100-authnz-5
CREATE TABLE preferences (
    uuid uuid NOT NULL DEFAULT extensions.uuid_generate_v7(),
    category TEXT NOT NULL ,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    account_uuid uuid,
    CONSTRAINT pk_preferences PRIMARY KEY (uuid),
    CONSTRAINT uq_preferences UNIQUE (account_uuid, category, key),
    CONSTRAINT fk_preferences_account FOREIGN KEY (account_uuid) REFERENCES account(uuid) ON DELETE CASCADE
);

--changeset rat:0100-authnz-6 runOnChange: true
CREATE VIEW account_preferences_view AS
WITH default_preferences AS (
    SELECT category, key, value
    FROM preferences
    WHERE account_uuid IS NULL
),
account_preferences AS (
    SELECT category, key, value, account_uuid
    FROM preferences
    WHERE account_uuid IS NOT NULL
)
SELECT
    COALESCE(ap.category, dp.category) AS category,
    COALESCE(ap.key, dp.key) AS key,
    COALESCE(ap.value, dp.value) AS value,
    ap.account_uuid
FROM
    default_preferences dp
LEFT JOIN
    account_preferences ap
ON
    dp.category = ap.category AND dp.key = ap.key
UNION
SELECT
    ap.category,
    ap.key,
    ap.value,
    ap.account_uuid
FROM
    account_preferences ap
LEFT JOIN
    default_preferences dp
ON
    ap.category = dp.category AND ap.key = dp.key
WHERE
    dp.key IS NULL;

--changeset rat:0100-authnz-7
INSERT INTO preferences(category, key, value, account_uuid) VALUES
	( 'general', 'lang', 'en', null),
	('general', 'theme', 'light', null);

