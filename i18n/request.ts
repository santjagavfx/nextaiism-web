import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./locales.mjs";
import en from "../messages/en.json";
import ru from "../messages/ru.json";
import es from "../messages/es.json";
import de from "../messages/de.json";
import fr from "../messages/fr.json";
import it from "../messages/it.json";
import ptBR from "../messages/pt-BR.json";
import pl from "../messages/pl.json";
import tr from "../messages/tr.json";
import id from "../messages/id.json";

const catalogs: Record<string, typeof en> = { en, ru, es, de, fr, it, "pt-BR": ptBR, pl, tr, id };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && Object.hasOwn(catalogs, requested) ? requested : defaultLocale;
  return { locale, messages: catalogs[locale] };
});
