drop policy "Authenticated can read only their own" on "public"."collection";

drop policy "Service role can read all" on "public"."collection";

drop policy "Public can read it all" on "public"."collection_link";

drop policy "Authenticated can read only their own" on "public"."link";

drop policy "Public can read only visible" on "public"."link";

create policy "Authenticated can read their own unpublished as well"
on "public"."collection"
as permissive
for select
to authenticated
using (((published = true) OR (( SELECT auth.uid() AS uid) = created_by)));


create policy "Authenticated can read only visible, but their own as well"
on "public"."collection_link"
as permissive
for select
to authenticated
using (((visible = true) OR (( SELECT auth.uid() AS uid) = ( SELECT l.created_by
   FROM link l
  WHERE (l.fingerprint = collection_link.link_pk)))));


create policy "Authenticated can read it all"
on "public"."link"
as permissive
for select
to authenticated
using (true);


create policy "Public can read it all"
on "public"."link"
as permissive
for select
to public
using (true);




