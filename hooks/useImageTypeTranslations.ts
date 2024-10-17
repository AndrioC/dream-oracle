import { useTranslations } from 'next-intl';
import { imageTypes } from '@/utils/image-types';

export function useImageTypeTranslations() {
  const t = useTranslations('imageTypes');

  const translatedImageTypes = Object.entries(imageTypes).reduce(
    (acc, [key, value]) => {
      acc[key] = t(value);
      return acc;
    },
    {} as Record<string, string>
  );

  return translatedImageTypes;
}
