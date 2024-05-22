drop policy "Authenticated can delete only their own" on "public"."link_collection";

drop policy "Authenticated can insert only as their own" on "public"."link_collection";

drop policy "Authenticated can read only their own" on "public"."link_collection";

drop policy "Authenticated can update only their own" on "public"."link_collection";

drop policy "Public can only read published" on "public"."link_collection";

drop policy "Service role can read all" on "public"."link_collection";

alter table "public"."link_collection" drop constraint "link_collection_created_by_fkey";

alter table "public"."link" drop constraint "link_collection_fkey";

alter table "public"."link_collection" drop constraint "link_collection_pkey";

alter table "public"."link" drop constraint "link_pkey";

alter table "public"."link_collection" drop constraint "link_collection_fingerprint_key";

drop index if exists "public"."link_collection_fingerprint_key";

drop index if exists "public"."link_collection_pkey";

drop index if exists "public"."link_pkey";

drop table "public"."link_collection";

create table "public"."collection" (
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null,
    "title" text not null,
    "description" text,
    "fingerprint" text not null,
    "published" boolean not null default true
);


alter table "public"."collection" enable row level security;

create table "public"."collection_link" (
    "id" bigint generated by default as identity not null,
    "collection" text not null,
    "link" text not null
);


alter table "public"."collection_link" enable row level security;

alter table "public"."link" drop column "id";

alter table "public"."link" add column "fingerprint" text not null default nanoid(10);

CREATE UNIQUE INDEX collection_link_pkey ON public.collection_link USING btree (id);

CREATE UNIQUE INDEX link_fingerprint_key ON public.link USING btree (fingerprint);

CREATE UNIQUE INDEX link_collection_fingerprint_key ON public.collection USING btree (fingerprint);

CREATE UNIQUE INDEX link_collection_pkey ON public.collection USING btree (fingerprint);

CREATE UNIQUE INDEX link_pkey ON public.link USING btree (fingerprint);

alter table "public"."collection" add constraint "link_collection_pkey" PRIMARY KEY using index "link_collection_pkey";

alter table "public"."collection_link" add constraint "collection_link_pkey" PRIMARY KEY using index "collection_link_pkey";

alter table "public"."link" add constraint "link_pkey" PRIMARY KEY using index "link_pkey";

alter table "public"."collection" add constraint "collection_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."collection" validate constraint "collection_created_by_fkey";

alter table "public"."collection" add constraint "link_collection_fingerprint_key" UNIQUE using index "link_collection_fingerprint_key";

alter table "public"."collection_link" add constraint "collection_link_collection_fkey" FOREIGN KEY (collection) REFERENCES collection(fingerprint) ON DELETE CASCADE not valid;

alter table "public"."collection_link" validate constraint "collection_link_collection_fkey";

alter table "public"."collection_link" add constraint "collection_link_link_fkey" FOREIGN KEY (link) REFERENCES link(fingerprint) ON DELETE CASCADE not valid;

alter table "public"."collection_link" validate constraint "collection_link_link_fkey";

alter table "public"."link" add constraint "link_fingerprint_key" UNIQUE using index "link_fingerprint_key";

create policy "Authenticated can delete only their own"
on "public"."collection"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can insert only as their own"
on "public"."collection"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can read only their own"
on "public"."collection"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can update only their own"
on "public"."collection"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Public can only read published"
on "public"."collection"
as permissive
for select
to public
using ((published = true));


create policy "Service role can read all"
on "public"."collection"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));




