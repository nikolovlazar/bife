drop policy "Public can read only published" on "public"."link_collection";

create policy "Service role can read all"
on "public"."link_collection"
as permissive
for select
to service_role
using ((published = true));




