import { ImageResponse } from "next/og";
import { BrandShareImage } from "@/lib/brand-image";

export const alt = "Prompt Claude logo and course branding";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<BrandShareImage />, {
    ...size,
  });
}
