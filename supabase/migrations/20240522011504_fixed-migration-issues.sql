alter table "public"."collection_link" drop constraint "collection_link_pkey";

drop index if exists "public"."collection_link_pkey";

alter table "public"."collection_link" drop column "id";

alter table "public"."link" drop column "collection";

CREATE UNIQUE INDEX collection_link_pkey ON public.collection_link USING btree (collection, link);

alter table "public"."collection_link" add constraint "collection_link_pkey" PRIMARY KEY using index "collection_link_pkey";

create policy "Public can read it all"
on "public"."collection_link"
as permissive
for select
to public
using (true);

create policy "Authenticated can only link their own collections and links"
on "public"."collection_link"
as permissive
for insert
to authenticated
with check (
  (select auth.uid() as uid) = (
    select created_by
    from collection as c
    where c.fingerprint = collection
  )
  and
  (select auth.uid() as uid) = (
    select created_by
    from link as l
    where l.fingerprint = link
  )
);


create policy "Authenticated can only remove their own relations"
on "public"."collection_link"
as permissive
for delete
to authenticated
using (
  (select auth.uid() as uid) = (
    select created_by
    from collection as c
    where c.fingerprint = collection
  )
  and
  (select auth.uid() as uid) = (
    select created_by
    from link as l
    where l.fingerprint = link
  )
);