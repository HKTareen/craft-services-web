"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isValidLocale } from "@/i18n/config";

export default function LangSetter() {
  const pathname = usePathname();

  useEffect(() => {
    const segment = pathname.split("/")[1];
    if (segment && isValidLocale(segment)) {
      document.documentElement.lang = segment;
    }
  }, [pathname]);

  return null;
}
