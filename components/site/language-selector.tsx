'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useCookies } from 'react-cookie';

import BrazilFlagSVG from '@/assets/brazil-flag.svg';
import USAFlagSVG from '@/assets/usa-flag.svg';

type LocaleKey = 'pt' | 'en';

interface Language {
  flag: string;
  label: string;
}

type Languages = {
  [K in LocaleKey]: Language;
};

const languages: Languages = {
  pt: { flag: BrazilFlagSVG, label: 'Português (Brasil)' },
  en: { flag: USAFlagSVG, label: 'English (United States)' },
};

interface CustomSelectValueProps {
  value: LocaleKey;
}

const CustomSelectValue: React.FC<CustomSelectValueProps> = ({ value }) => {
  const language = languages[value];
  return (
    <div className="flex items-center">
      {language && (
        <Image
          src={language.flag}
          alt={`${language.label} flag`}
          width={24}
          height={16}
          className="mr-2"
        />
      )}
      <span>{language?.label || 'Select language'}</span>
    </div>
  );
};

export default function LanguageSelectorHeader() {
  const [cookies, setCookie] = useCookies(['NEXT_LOCALE']);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSelector');
  const [currentLocale, setCurrentLocale] = useState<LocaleKey>('pt');

  useEffect(() => {
    const savedLocale = (cookies.NEXT_LOCALE || 'pt') as LocaleKey;
    setCurrentLocale(savedLocale);
  }, [cookies.NEXT_LOCALE]);

  const handleLanguageChange = (newLocale: LocaleKey) => {
    setCookie('NEXT_LOCALE', newLocale, { path: '/' });
    setCurrentLocale(newLocale);

    const newPathname = pathname.replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="container mx-auto flex justify-end">
        <Select value={currentLocale} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[280px] bg-purple-800 text-white border-purple-600">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue>
              <CustomSelectValue value={currentLocale} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(languages) as LocaleKey[]).map((value) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center">
                  <Image
                    src={languages[value].flag}
                    alt={`${t(value)} flag`}
                    width={24}
                    height={16}
                    className="mr-2"
                  />
                  <span>{t(value)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
