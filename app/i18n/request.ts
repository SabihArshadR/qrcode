import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async () => {
  // 1) Check explicit cookie first
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  let locale: string | undefined = cookieLocale;

  // 2) Fallback to device / browser language
  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') ?? '';
    const detected = acceptLanguage.split(',')[0].trim().split('-')[0];

    if (locales.includes(detected as (typeof locales)[number])) {
      locale = detected;
    }
  }

  // 3) Final safety fallback
  if (!locale) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

// import {getRequestConfig} from 'next-intl/server';
 
// export default getRequestConfig(async () => {
//   // Provide a static locale, fetch a user setting,
//   // read from `cookies()`, `headers()`, etc.
//   const locale = 'en';
 
//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });

// i18n/request.ts

// import { getRequestConfig } from 'next-intl/server';
// import { cookies } from 'next/headers';

// export default getRequestConfig(async () => {
//   const cookieStore = cookies();
//   const locale = (await cookieStore).get('NEXT_LOCALE')?.value || 'ca';

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });