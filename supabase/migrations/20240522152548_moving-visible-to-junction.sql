-- Add the new column to the junction table
alter table "public"."collection_link" add column "visible" boolean;

-- Update the new column with the value from the link table
update "public"."collection_link" cl
set visible = l.visible
from "public"."link" l
where cl.link_pk = l.fingerprint;

-- The old policy depends on the old column, so we need to modify it to use the new column
drop policy "Public can read only visible" on "public"."link";
create policy "Public can read only visible"
on "public"."link"
as permissive
for select
to public
using (
  (select cl.visible from collection_link cl where cl.link_pk = fingerprint) = true
);

-- We should also create a new policy for the collection_link table to ensure that public can only read visible links
create policy "Public can read only visible"
on "public"."collection_link"
as permissive
for select
to public
using (visible = true);

-- Add an update policy for authenticated users
create policy "Authenticated can only modify visibility of their own collection and links"
on "public"."collection_link"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = ( SELECT c.created_by
   FROM collection c
  WHERE (c.fingerprint = collection_link.collection_pk))) AND (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link_pk)))))
with check (((( SELECT auth.uid() AS uid) = ( SELECT c.created_by
   FROM collection c
  WHERE (c.fingerprint = collection_link.collection_pk))) AND (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link_pk)))));

-- Drop the old column from the link table
alter table "public"."link" drop column "visible";