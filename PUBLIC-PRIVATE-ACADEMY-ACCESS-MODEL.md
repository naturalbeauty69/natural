# Academy public/private access model

PUBLIC resources:
- access_level = public
- visible without login

PRIVATE resources:
- access_level = students / approved / staff
- authenticated and approved access required

Registration:
- student/staff accounts start pending
- only owner/director approval changes them to approved
- private resource access remains enforced by Supabase RLS/Storage

The Academy resources page itself does not force login; public resources stay publicly browsable.
