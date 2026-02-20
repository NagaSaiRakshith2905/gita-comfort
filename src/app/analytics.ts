"use client";
import { configure } from "onedollarstats";
import { useEffect } from "react";

export default function Analytics() {
  useEffect(() => {
    configure({ hostname: "gitacomforts.me", devmode: true });
  }, []);

  return null;
}