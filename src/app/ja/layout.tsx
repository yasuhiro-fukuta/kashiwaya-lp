import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "柏屋 — 中山道・三留野宿の古民家ゲストハウス|南木曽・木曽路(長野県)",
  description:
    "柏屋(かしわや)は、中山道41番目の宿場・三留野宿(長野県南木曽町)にある築140年の古民家ゲストハウス。妻籠宿・馬籠宿にほど近く、家庭的な鍋の夕食と柏屋限定クラフトビールでお迎えします。南木曽駅から徒歩15分。",
  alternates: {
    canonical: "/ja",
    languages: { en: "/", ja: "/ja", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: "https://kashiwaya-inn.com/ja",
    siteName: "Kashiwaya Inn",
    title: "柏屋 — 中山道・三留野宿の古民家ゲストハウス|南木曽・木曽路",
    description:
      "中山道41番目の宿場・三留野宿にある築140年の古民家ゲストハウス。妻籠・馬籠にほど近く、南木曽駅から徒歩15分。",
    images: [{ url: "/gallery/entrance.JPG" }],
    locale: "ja_JP",
  },
};

export default function JaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div lang="ja">{children}</div>;
}
