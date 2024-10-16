'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

  const sections = [
    'informationCollected',
    'informationUsage',
    'informationSharing',
    'dataSecurity',
    'userRights',
    'aiUsage',
    'cookies',
    'policyChanges',
    'contact',
  ];

  const informationUsageItems = ['item1', 'item2', 'item3', 'item4', 'item5'];
  const informationSharingItems = ['item1', 'item2', 'item3', 'item4'];

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
              {section === 'informationCollected' && (
                <>
                  <p>{t(`sections.${section}.content1`)}</p>
                  <p className="mt-2">{t(`sections.${section}.content2`)}</p>
                </>
              )}
              {section === 'informationUsage' && (
                <>
                  <p>{t(`sections.${section}.content`)}</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    {informationUsageItems.map((item, index) => (
                      <li key={index}>
                        {t(`sections.${section}.items.${item}`)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {section === 'informationSharing' && (
                <>
                  <p>{t(`sections.${section}.content1`)}</p>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    {informationSharingItems.map((item, index) => (
                      <li key={index}>
                        {t(`sections.${section}.items.${item}`)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">{t(`sections.${section}.content2`)}</p>
                </>
              )}
              {[
                'dataSecurity',
                'userRights',
                'aiUsage',
                'cookies',
                'policyChanges',
                'contact',
              ].includes(section) && <p>{t(`sections.${section}.content`)}</p>}
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
