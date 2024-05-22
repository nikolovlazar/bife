drop policy "Authenticated can only link their own collections and links" on "public"."collection_link";

drop policy "Authenticated can only remove their own collection and link rel" on "public"."collection_link";

alter table "public"."collection_link" drop constraint "collection_link_collection_fkey";

alter table "public"."collection_link" drop constraint "collection_link_link_fkey";

alter table "public"."collection_link" drop constraint "collection_link_pkey";

drop index if exists "public"."collection_link_pkey";

alter table "public"."collection_link" drop column "collection";

alter table "public"."collection_link" drop column "link";

alter table "public"."collection_link" add column "collection_pk" text not null;

alter table "public"."collection_link" add column "link_pk" text not null;

CREATE UNIQUE INDEX collection_link_pkey ON public.collection_link USING btree (collection_pk, link_pk);

alter table "public"."collection_link" add constraint "collection_link_pkey" PRIMARY KEY using index "collection_link_pkey";

alter table "public"."collection_link" add constraint "collection_link_collection_pk_fkey" FOREIGN KEY (collection_pk) REFERENCES collection(fingerprint) ON DELETE CASCADE not valid;

alter table "public"."collection_link" validate constraint "collection_link_collection_pk_fkey";

alter table "public"."collection_link" add constraint "collection_link_link_pk_fkey" FOREIGN KEY (link_pk) REFERENCES link(fingerprint) ON DELETE CASCADE not valid;

alter table "public"."collection_link" validate constraint "collection_link_link_pk_fkey";

create policy "Authenticated can only link their own collections and links"
on "public"."collection_link"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = ( SELECT c.created_by
   FROM collection c
  WHERE (c.fingerprint = collection_link.collection_pk))) AND (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link_pk)))));


create policy "Authenticated can only remove their own collection and link rel"
on "public"."collection_link"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT c.created_by
   FROM collection c
  WHERE (c.fingerprint = collection_link.collection_pk))) AND (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link_pk)))));




