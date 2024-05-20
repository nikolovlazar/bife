drop policy "Can only insert collections as yourself" on "public"."link_collection";

drop policy "Can only update your own collections" on "public"."link_collection";

drop policy "Can read without constraints" on "public"."link_collection";

drop policy "Enable delete for users based on user_id" on "public"."link_collection";

alter table "public"."link" drop column "meta_data";

create policy "Authenticated can delete only their own"
on "public"."link"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can insert only as their own"
on "public"."link"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can read only their own"
on "public"."link"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can update only their own"
on "public"."link"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Public can read only visible"
on "public"."link"
as permissive
for select
to public
using ((visible = true));


create policy "Authenticated can delete only their own"
on "public"."link_collection"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can insert only as their own"
on "public"."link_collection"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can read only their own"
on "public"."link_collection"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Authenticated can update only their own"
on "public"."link_collection"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by))
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Public can read only published"
on "public"."link_collection"
as permissive
for select
to public
using ((published = true));




