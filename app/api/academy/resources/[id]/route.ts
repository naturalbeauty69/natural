import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-admin/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const wantsDownload = url.searchParams.get("download") === "1";

  const supabase = await createClient();

  // RLS is the access-control layer here. A user only receives a resource
  // row if the Academy migration says that user may access it.
  const { data: resource, error } = await supabase
    .from("academy_resources")
    .select("id, storage_path, storage_url, google_drive_url, download_enabled, is_active")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !resource) {
    return NextResponse.json({ error: "Resource not found or access denied." }, { status: 404 });
  }

  if (wantsDownload && !resource.download_enabled) {
    return NextResponse.json({ error: "Downloading is disabled for this resource." }, { status: 403 });
  }

  if (resource.storage_path) {
    const { data: signed, error: signedError } = await supabase.storage
      .from("krish")
      .createSignedUrl(resource.storage_path, 300);

    if (signedError || !signed?.signedUrl) {
      return NextResponse.json({ error: "Could not create a secure file link." }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  }

  const externalUrl = resource.google_drive_url || resource.storage_url;
  if (!externalUrl) {
    return NextResponse.json({ error: "This resource has no file or link." }, { status: 404 });
  }

  return NextResponse.redirect(externalUrl);
}
