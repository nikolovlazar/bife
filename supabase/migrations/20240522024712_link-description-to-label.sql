drop policy "Authenticated can only remove their own relations" on "public"."collection_link";

alter table "public"."link" drop column "description";

alter table "public"."link" add column "label" text not null;

create policy "Authenticated can only remove their own collection and link rel"
on "public"."collection_link"
as permissive
for delete
to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT c.created_by
   FROM collection c
  WHERE (c.fingerprint = collection_link.collection))) AND (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link)))));




