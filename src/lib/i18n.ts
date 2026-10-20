export type Lang = 'el' | 'en';

const routePairs: Array<[string, string]> = [
  ['/', '/en'],
  ['/o-iatros', '/en/about'],
  ['/iatreio', '/en/clinic'],
  ['/pathiseis', '/en/conditions'],
  ['/epemvaseis', '/en/procedures'],
  ['/nea', '/en/articles'],
  ['/epikoinonia', '/en/contact'],
  ['/apopoiisi', '/en/disclaimer'],
];

/**
 * Astro's static build exposes `/en.html` (or `/o-iatros.html`) as the
 * pathname, while production serves clean URLs. Normalise both forms so
 * language detection, hreflang and the switcher work in dev and production.
 */
const normalize = (pathname: string): string => {
  const clean = pathname.replace(/\/+$/, '').replace(/\.html$/, '');
  return clean || '/';
};

export const isEnglish = (pathname: string): boolean => {
  const path = normalize(pathname);
  return path === '/en' || path.startsWith('/en/');
};

export const langOf = (pathname: string): Lang => (isEnglish(pathname) ? 'en' : 'el');

/**
 * Returns the counterpart URL for the current page, preserving the inner slug.
 * Greek and English routes are intentionally different where the English URL
 * reads better ("/o-iatros" → "/en/about").
 */
export function alternatePath(pathname: string): string {
  const path = normalize(pathname);

  if (path === '/') return '/en';
  if (path === '/en') return '/';

  if (path.startsWith('/en/')) {
    const englishPath = path.slice(3); // "/conditions/diarrhea"
    for (const [el, en] of routePairs) {
      const englishBase = en.slice(3); // "/conditions"
      if (!englishBase) continue;
      if (englishPath === englishBase || englishPath.startsWith(`${englishBase}/`)) {
        const suffix = englishPath.slice(englishBase.length);
        return `${el === '/' ? '' : el}${suffix}` || '/';
      }
    }
    return '/';
  }

  for (const [el, en] of routePairs) {
    if (path === el || path.startsWith(`${el}/`)) {
      return `${en}${path.slice(el.length)}`;
    }
  }

  return '/en';
}

export function hreflangPaths(pathname: string): { el: string; en: string } {
  const path = normalize(pathname);
  const lang = isEnglish(path);
  const alternate = alternatePath(path);
  return {
    el: lang ? alternate : path,
    en: lang ? path : alternate,
  };
}
