drop policy "Can read without constraints" on "public"."link";

alter table "public"."link" drop constraint "link_collection_fkey";

alter table "public"."link_collection" drop constraint "link_collection_pkey";

drop index if exists "public"."link_collection_pkey";

alter table "public"."link" add column "visible" boolean not null default true;

alter table "public"."link" alter column "collection" drop not null;

alter table "public"."link" alter column "collection" set data type text using "collection"::text;

alter table "public"."link_collection" drop column "id";

alter table "public"."link_collection" add column "published" boolean not null default true;

CREATE UNIQUE INDEX link_collection_pkey ON public.link_collection USING btree (fingerprint);

alter table "public"."link_collection" add constraint "link_collection_pkey" PRIMARY KEY using index "link_collection_pkey";

alter table "public"."link" add constraint "link_collection_fkey" FOREIGN KEY (collection) REFERENCES link_collection(fingerprint) ON DELETE CASCADE not valid;

alter table "public"."link" validate constraint "link_collection_fkey";

create policy "Enable delete for users based on user_id"
on "public"."link_collection"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));




