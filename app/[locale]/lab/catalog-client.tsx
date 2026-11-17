"use client";

import { useState, type ReactNode } from "react";
import styles from "./lab.module.css";

type Option = { value: string; label: string };
type Card = { id: string; title: string; category: string; status: string; card: ReactNode };
type Props = {
  locale: string;
  cards: Card[];
  categories: Option[];
  statuses: Option[];
  labels: { search: string; category: string; status: string; all: string; empty: string };
};

export function Catalog({ locale, cards, categories, statuses, labels }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const normalize = (value: string) => value.normalize("NFC").toLocaleLowerCase(locale);
  const visible = cards.filter((item) =>
    normalize(item.title).includes(normalize(query.trim())) &&
    (!category || item.category === category) &&
    (!status || item.status === status)
  );

  return (
    <>
      <div className={styles.filters}>
        <label>{labels.search}<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label>{labels.category}
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">{labels.all}</option>
            {categories.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>{labels.status}
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">{labels.all}</option>
            {statuses.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      {visible.length ? <ul className={styles.grid}>{visible.map(({ id, card }) => <li key={id}>{card}</li>)}</ul>
        : <p role="status">{labels.empty}</p>}
    </>
  );
}
