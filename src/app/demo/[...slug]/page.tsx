import EasterEggPage from "@/components/demo/EasterEggPage";

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <EasterEggPage slug={slug[0] ?? ""} />;
}
