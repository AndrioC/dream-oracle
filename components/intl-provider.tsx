'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

import ptBR from '@/locales/pt-BR.json';
import enUS from '@/locales/en-US.json';

const messages = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

type Locale = keyof typeof messages;

async function fetchUserSettings() {
  const { data } = await axios.get('/api/users/load-settings');
  return data;
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt-BR');

  const { data: userSettings } = useQuery({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (userSettings?.language) {
      setLocale(userSettings.language as Locale);
    }
  }, [userSettings]);

  return (
    <NextIntlClientProvider messages={messages[locale]} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
