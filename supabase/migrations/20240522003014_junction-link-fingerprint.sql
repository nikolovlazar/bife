-- Create nanoid function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- The `nanoid()` function generates a compact, URL-friendly unique identifier.
-- Based on the given size and alphabet, it creates a randomized string that's ideal for
-- use-cases requiring small, unpredictable IDs (e.g., URL shorteners, generated file names, etc.).
-- While it comes with a default configuration, the function is designed to be flexible,
-- allowing for customization to meet specific needs.
CREATE OR REPLACE FUNCTION nanoid(
    size int DEFAULT 21, -- The number of symbols in the NanoId String. Must be greater than 0.
    alphabet text DEFAULT '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', -- The symbols used in the NanoId String. Must contain between 1 and 255 symbols.
    additionalBytesFactor float DEFAULT 1.6 -- The additional bytes factor used for calculating the step size. Must be equal or greater then 1.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
    -- Uncomment the following line if you have superuser privileges
    -- LEAKPROOF
AS
$$
DECLARE
    alphabetArray  text[];
    alphabetLength int := 64;
    mask           int := 63;
    step           int := 34;
BEGIN
    IF size IS NULL OR size < 1 THEN
        RAISE EXCEPTION 'The size must be defined and greater than 0!';
    END IF;

    IF alphabet IS NULL OR length(alphabet) = 0 OR length(alphabet) > 255 THEN
        RAISE EXCEPTION 'The alphabet can''t be undefined, zero or bigger than 255 symbols!';
    END IF;

    IF additionalBytesFactor IS NULL OR additionalBytesFactor < 1 THEN
        RAISE EXCEPTION 'The additional bytes factor can''t be less than 1!';
    END IF;

    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);
    mask := (2 << cast(floor(log(alphabetLength - 1) / log(2)) as int)) - 1;
    step := cast(ceil(additionalBytesFactor * mask * size / alphabetLength) AS int);

    IF step > 1024 THEN
        step := 1024; -- The step size % can''t be bigger then 1024!
    END IF;

    RETURN nanoid_optimized(size, alphabet, mask, step);
END
$$;

-- Generates an optimized random string of a specified size using the given alphabet, mask, and step.
-- This optimized version is designed for higher performance and lower memory overhead.
-- No checks are performed! Use it only if you really know what you are doing.
CREATE OR REPLACE FUNCTION nanoid_optimized(
    size int, -- The desired length of the generated string.
    alphabet text, -- The set of characters to choose from for generating the string.
    mask int, -- The mask used for mapping random bytes to alphabet indices. Should be `(2^n) - 1` where `n` is a power of 2 less than or equal to the alphabet size.
    step int -- The number of random bytes to generate in each iteration. A larger value may speed up the function but increase memory usage.
)
    RETURNS text -- A randomly generated NanoId String
    LANGUAGE plpgsql
    VOLATILE
    PARALLEL SAFE
    -- Uncomment the following line if you have superuser privileges
    -- LEAKPROOF
AS
$$
DECLARE
    idBuilder      text := '';
    counter        int  := 0;
    bytes          bytea;
    alphabetIndex  int;
    alphabetArray  text[];
    alphabetLength int  := 64;
BEGIN
    alphabetArray := regexp_split_to_array(alphabet, '');
    alphabetLength := array_length(alphabetArray, 1);

    LOOP
        bytes := gen_random_bytes(step);
        FOR counter IN 0..step - 1
            LOOP
                alphabetIndex := (get_byte(bytes, counter) & mask) + 1;
                IF alphabetIndex <= alphabetLength THEN
                    idBuilder := idBuilder || alphabetArray[alphabetIndex];
                    IF length(idBuilder) = size THEN
                        RETURN idBuilder;
                    END IF;
                END IF;
            END LOOP;
    END LOOP;
END
$$;

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




