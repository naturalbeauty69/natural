"use client";

import { useEffect } from "react";
import { trackBlogRead } from "@/lib/analytics";

export default function BlogReadTracker({ title, category }: { title: string; category?: string }) {
  useEffect(() => {
    trackBlogRead(title, category);
  }, [title, category]);

  return null;
}
