-- Add the order column to the collection_link table
alter table "public"."collection_link" add column "order" integer generated by default as identity not null;