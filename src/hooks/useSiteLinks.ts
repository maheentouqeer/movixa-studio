import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const SOCIAL_KEYS = ["instagram_url", "youtube_url", "facebook_url"] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];

const DEFAULTS: Record<SocialKey, string> = {
  instagram_url: "https://instagram.com",
  youtube_url: "https://youtube.com",
  facebook_url: "https://facebook.com",
};

/** Admin-editable social links stored in public.site_settings. */
export function useSiteLinks() {
  const [links, setLinks] = useState<Record<SocialKey, string>>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", SOCIAL_KEYS as unknown as string[]);
      if (cancelled || !data) return;
      const next = { ...DEFAULTS };
      for (const row of data as { key: string; value: string }[]) {
        if ((SOCIAL_KEYS as readonly string[]).includes(row.key) && row.value) {
          next[row.key as SocialKey] = row.value;
        }
      }
      setLinks(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return links;
}
