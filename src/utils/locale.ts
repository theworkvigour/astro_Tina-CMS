import { getEntry } from 'astro:content';
import { I18N } from 'astrowind:config';
import langs from '~/data/site/languages.yaml';

type LangEntry = { code: string; name: string; locale: string; textDirection: string };
const langList = langs as LangEntry[];

export const AVAILABLE_LOCALES = langList.map((l) => l.locale) as [string, ...string[]];
export type Locale = (typeof AVAILABLE_LOCALES)[number];

export function getLocale(): Locale {
  return (I18N?.language as Locale) || 'en';
}

type DeepRecord = Record<string, unknown>;

export async function getLocaleData<T = DeepRecord>(
  collection: string,
  id: string,
  fallbackData?: T
): Promise<T> {
  const locale = getLocale();
  try {
    const entry = await getEntry(collection as any, id);
    const ksData = ((entry?.data as Record<string, unknown>)?.[locale] ||
      (entry?.data as Record<string, unknown>)?.['en'] ||
      {}) as T;
    if (Object.keys(ksData as Record<string, unknown>).length > 0) {
      return ksData;
    }
  } catch {
    // fallback
  }
  return fallbackData ?? ({} as T);
}
