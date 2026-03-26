export const FONT_FAMILY = {
  regular: "Lufga-Regular",
  medium: "Lufga-Medium",
  semibold: "Lufga-Semibold",
  bold: "Lufga-Bold",
} as const;

export type FontFamilyName = (typeof FONT_FAMILY)[keyof typeof FONT_FAMILY];
