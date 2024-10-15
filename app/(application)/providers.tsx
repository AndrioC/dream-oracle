'use client';

import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import axios from 'axios';
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

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>('pt-BR');

  const {
    data: userSettings,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
    enabled: status === 'authenticated',
    staleTime: Infinity,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSuccess && userSettings) {
      if (userSettings.language) {
        setLocale(userSettings.language as Locale);
      }
      if (userSettings.theme) {
        localStorage.setItem('theme', userSettings.theme);
      }
    }
  }, [isSuccess, userSettings]);

  if (
    !mounted ||
    status === 'loading' ||
    (status === 'authenticated' && isLoading)
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  const storedTheme =
    typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
  const initialTheme = storedTheme || 'system';

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem
      disableTransitionOnChange
      forcedTheme={userSettings?.theme}
    >
      <NextIntlClientProvider messages={messages[locale]} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>{children}</SettingsProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
