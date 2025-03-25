--liquibase formatted sql
--changeset rat:0300-chinook-1
--update email, that is not valid according to zod
UPDATE customer SET email = 'stanislaw.wojcik@wp.pl' where customer_id=49;
