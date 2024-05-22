drop policy "Service role can read all" on "public"."link_collection";

create policy "Public can only read published"
on "public"."link_collection"
as permissive
for select
to public
using ((published = true));


create policy "Service role can read all"
on "public"."link_collection"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));




