
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."collection" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "fingerprint" "text" NOT NULL,
    "published" boolean DEFAULT true NOT NULL
);

ALTER TABLE "public"."collection" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."collection_link" (
    "collection_pk" "text" NOT NULL,
    "link_pk" "text" NOT NULL
);

ALTER TABLE "public"."collection_link" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."link" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "url" "text" NOT NULL,
    "visible" boolean DEFAULT true NOT NULL,
    "fingerprint" "text" NOT NULL,
    "label" "text" NOT NULL
);

ALTER TABLE "public"."link" OWNER TO "postgres";

ALTER TABLE ONLY "public"."collection_link"
    ADD CONSTRAINT "collection_link_pkey" PRIMARY KEY ("collection_pk", "link_pk");

ALTER TABLE ONLY "public"."collection"
    ADD CONSTRAINT "link_collection_fingerprint_key" UNIQUE ("fingerprint");

ALTER TABLE ONLY "public"."collection"
    ADD CONSTRAINT "link_collection_pkey" PRIMARY KEY ("fingerprint");

ALTER TABLE ONLY "public"."link"
    ADD CONSTRAINT "link_fingerprint_key" UNIQUE ("fingerprint");

ALTER TABLE ONLY "public"."link"
    ADD CONSTRAINT "link_pkey" PRIMARY KEY ("fingerprint");

ALTER TABLE ONLY "public"."collection"
    ADD CONSTRAINT "collection_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."collection_link"
    ADD CONSTRAINT "collection_link_collection_pk_fkey" FOREIGN KEY ("collection_pk") REFERENCES "public"."collection"("fingerprint") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."collection_link"
    ADD CONSTRAINT "collection_link_link_pk_fkey" FOREIGN KEY ("link_pk") REFERENCES "public"."link"("fingerprint") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."link"
    ADD CONSTRAINT "link_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Authenticated can delete only their own" ON "public"."collection" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can delete only their own" ON "public"."link" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can insert only as their own" ON "public"."collection" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can insert only as their own" ON "public"."link" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can only link their own collections and links" ON "public"."collection_link" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = ( SELECT "c"."created_by"
   FROM "public"."collection" "c"
  WHERE ("c"."fingerprint" = "collection_link"."collection_pk"))) AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "l"."created_by"
   FROM "public"."link" "l"
  WHERE ("l"."fingerprint" = "collection_link"."link_pk")))));

CREATE POLICY "Authenticated can only remove their own collection and link rel" ON "public"."collection_link" FOR DELETE TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = ( SELECT "c"."created_by"
   FROM "public"."collection" "c"
  WHERE ("c"."fingerprint" = "collection_link"."collection_pk"))) AND (( SELECT "auth"."uid"() AS "uid") = ( SELECT "l"."created_by"
   FROM "public"."link" "l"
  WHERE ("l"."fingerprint" = "collection_link"."link_pk")))));

CREATE POLICY "Authenticated can read only their own" ON "public"."collection" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can read only their own" ON "public"."link" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can update only their own" ON "public"."collection" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Authenticated can update only their own" ON "public"."link" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Public can only read published" ON "public"."collection" FOR SELECT USING (("published" = true));

CREATE POLICY "Public can read it all" ON "public"."collection_link" FOR SELECT USING (true);

CREATE POLICY "Public can read only visible" ON "public"."link" FOR SELECT USING (("visible" = true));

CREATE POLICY "Service role can read all" ON "public"."collection" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

ALTER TABLE "public"."collection" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."collection_link" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."link" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."collection" TO "anon";
GRANT ALL ON TABLE "public"."collection" TO "authenticated";
GRANT ALL ON TABLE "public"."collection" TO "service_role";

GRANT ALL ON TABLE "public"."collection_link" TO "anon";
GRANT ALL ON TABLE "public"."collection_link" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_link" TO "service_role";

GRANT ALL ON TABLE "public"."link" TO "anon";
GRANT ALL ON TABLE "public"."link" TO "authenticated";
GRANT ALL ON TABLE "public"."link" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
