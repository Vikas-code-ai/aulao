// @refresh reload
import { Suspense, createContext } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";

import "./css/root.css";

// import { dict } from "~/i18n-dict";
import { defaultLocale, locales } from "./constants";

function getLocaleFromPath(path: string) {
  const segments = path.split("/");
  return locales.includes(segments[1]) ? segments[1] : defaultLocale;
}

const LangContext = createContext("es");

export default function Root() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html class="bg-white" data-theme="mytheme">
      <Head>
        <Title>Aulao</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            {/* <I18nProvider dict={dict} locale={locale}> */}
            <LangContext.Provider value={locale}>
              <nav class="bg-sky-800">
                <ul class="container flex items-center p-3 text-gray-200">
                  <li
                    class={`border-b-2 ${active("/horarios")} mx-1.5 sm:mx-6`}
                  >
                    <A href="/horarios">Horarios</A>
                  </li>
                  <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
                    <A href="/about">About</A>
                  </li>
                </ul>
              </nav>
              <Routes>
                <FileRoutes />
              </Routes>
            </LangContext.Provider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
