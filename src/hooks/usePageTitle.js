import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | RG 158 Entertainment`
      : 'RG 158 Entertainment | Event Venue & Sports Bar | Saraland, AL';
  }, [title]);
}
