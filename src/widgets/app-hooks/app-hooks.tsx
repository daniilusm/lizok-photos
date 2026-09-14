import { useEffect, useState } from "react";

import {
  gaTrackingId,
  isDev,
  isProdServer,
  isStagingServer,
  yandexTrackingId,
} from "@/shared/config/vars";
import {
  COOKIE_CONSENT_EVENT,
  hasCookieConsent,
} from "@/widgets/cookie-consent/constants";

import { GAScripts } from "./app-ga";
import { useFontsLoaded } from "./use-fonts-loaded";
import { useFoucFix } from "./use-fouc-fix";
import { YandexMetrika } from "./yandex-metrika";

/* APP HOOKS */

export const AppHooks = () => {
  useFontsLoaded();
  useFoucFix();

  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAnalyticsAllowed(hasCookieConsent());

    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Не грузим аналитику в dev и на staging.
  // Только после согласия на cookie (localStorage).
  const enableAnalytics =
    analyticsAllowed &&
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
