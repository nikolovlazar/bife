-- Remove the default value of the fingerprint column
alter table "public"."link" alter column "fingerprint" drop default;

-- Remove the default value of the label column
alter table "public"."link" alter column "label" drop default;

-- Remove the not null constraint on the label column
alter table "public"."link" alter column "label" drop not null;