import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sections } from "../sections";

type SectionPageProps = { params: Promise<{ section: string }> };

async function getSection(params: SectionPageProps["params"]) {
  const { section } = await params;
  const match = sections.find(({ slug }) => slug === section);
  if (!match) notFound();
  return match;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { title, description } = await getSection(params);
  return { title, description };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const section = await getSection(params);
  return (
    <article className="shell section-page">
      <Link href="/#directions" className="back-link">← Research directions</Link>
      <p className="eyebrow"><span className="signal" /> {section.label}</p>
      <h1>{section.title}<span>.</span></h1>
      <p className="hero-subtitle">{section.description}</p>
      <p className="section-detail">{section.detail}</p>
    </article>
  );
}
