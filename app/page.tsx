import Link from "next/link";
import { sections } from "./sections";

export default function Home() {
  return (
    <>
      <section className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="signal" /> Living AI Laboratory</p>
          <h1>NextAIism<span>.</span></h1>
          <p className="hero-subtitle">The space between human<br className="hidden sm:block" /> and machine intelligence.</p>
          <p className="lede">A living laboratory for exploring what humans and AI can create together.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/lab" className="button primary">Explore the LAB <span aria-hidden="true">↗</span></Link>
            <Link href="#directions" className="button secondary">Research directions <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <div className="core-scene" aria-hidden="true">
          <div className="core-grid" />
          <div className="orbit orbit-one"><span /></div>
          <div className="orbit orbit-two"><span /></div>
          <div className="orbit orbit-three"><span /></div>
          <div className="core-halo" />
          <div className="core" />
          <span className="scene-label human">HUMAN</span>
          <span className="scene-label machine">MACHINE</span>
        </div>
      </section>
      <section className="directions shell" id="directions" aria-labelledby="directions-title">
        <p className="eyebrow">NextAIism / Research</p>
        <h2 id="directions-title">Research directions</h2>
        <div className="direction-grid">
          {sections.map((section) => (
            <Link className="direction" key={section.slug} href={`/${section.slug}`}>
              <span className="eyebrow">{section.label}</span>
              <h3>{section.title} <span aria-hidden="true">↗</span></h3>
              <p>{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
