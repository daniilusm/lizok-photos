import {
  gaTrackingId,
  isDev,
  isProdServer,
  isStagingServer,
  yandexTrackingId,
} from "@/shared/config/vars";

import { GAScripts } from "./app-ga";
import { useFontsLoaded } from "./use-fonts-loaded";
import { useFoucFix } from "./use-fouc-fix";
import { YandexMetrika } from "./yandex-metrika";

/* APP HOOKS */

export const AppHooks = () => {
  useFontsLoaded();
  useFoucFix();

  // Не грузим аналитику в dev и на staging.
  // Раньше требовался только NEXT_PUBLIC_APP_ENV=production — без него
  // счётчик не монтировался даже при заданном ID (часто на Vercel).
  const enableAnalytics =
    !isDev &&
    !isStagingServer &&
    (isProdServer || Boolean(yandexTrackingId || gaTrackingId));

  if (!enableAnalytics) return null;

  return (
    <>
      {gaTrackingId && <GAScripts />}
      {yandexTrackingId && <YandexMetrika />}
    </>
  );
};

/* APP HOOKS */
