'use client';

import { useTranslations } from 'next-intl';

export default function TermsOfUse() {
  const t = useTranslations('TermsOfUse');

  const sections = [
    'acceptance',
    'description',
    'usage',
    'account',
    'credits',
    'intellectualProperty',
    'community',
    'liability',
    'userConduct',
    'modifications',
    'termination',
    'applicableLaw',
    'contact',
  ];

  const userConductItems = ['item1', 'item2', 'item3', 'item4', 'item5'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>
        <div className="max-w-3xl mx-auto space-y-6 text-purple-200">
          <p>{t('introduction')}</p>

          {sections.map((section) => (
            <div key={section}>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
                {t(`sections.${section}.title`)}
              </h2>
              <p>{t(`sections.${section}.content`)}</p>
              {section === 'credits' && (
                <p className="font-semibold mt-2">
                  {t('sections.credits.important')}
                </p>
              )}
              {section === 'intellectualProperty' && (
                <p className="mt-2">
                  {t('sections.intellectualProperty.content2')}
                </p>
              )}
              {section === 'community' && (
                <p className="mt-2">{t('sections.community.content2')}</p>
              )}
              {section === 'userConduct' && (
                <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
                  {userConductItems.map((item, index) => (
                    <li key={index}>
                      {t(`sections.userConduct.items.${item}`)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <p className="mt-8">
            {t('lastUpdate', { date: new Date().toLocaleDateString() })}
          </p>
        </div>
      </div>
    </div>
  );
}
