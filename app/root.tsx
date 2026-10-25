import { useStore } from '@nanostores/react';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import xtermStyles from '@xterm/xterm/css/xterm.css?url';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type LinksFunction } from 'react-router';
import { cssTransition, ToastContainer } from 'react-toastify';

import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import { ClientOnly } from 'remix-utils/client-only';

import 'virtual:uno.css';

const toastAnimation = cssTransition({
  enter: 'animated fadeInRight',
  exit: 'animated fadeOutRight',
});

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: '/favicon.svg',
    type: 'image/svg+xml',
  },
  { rel: 'stylesheet', href: reactToastifyStyles },
  { rel: 'stylesheet', href: tailwindReset },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: xtermStyles },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    rel: 'preconnect',
    href: 'https://unpkg.com',
  },
  {
    rel: 'dns-prefetch',
    href: 'https://unpkg.com',
  },
];

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();

  function setTutorialKitTheme() {
    try {
      const options = JSON.parse(localStorage.getItem('bolt_interface_options') || '{}');
      const root = document.documentElement;
      root.dataset.accentIntensity = String(typeof options.accentIntensity === 'number' ? options.accentIntensity : 50);
      root.style.setProperty('--interface-accent-strength', String(typeof options.accentIntensity === 'number' ? options.accentIntensity : 50) + '%');
      root.dataset.cornerRadius = ['sharp', 'soft', 'round'].includes(options.cornerRadius) ? options.cornerRadius : 'soft';
      root.dataset.compactMode = String(Boolean(options.compactMode));
      root.dataset.animatedTransitions = String(options.animatedTransitions !== false);
    } catch {}
    let colorTheme = localStorage.getItem('bolt_theme');

    if (!colorTheme) {
      colorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-dracula' : 'light';
    }

    const mode = colorTheme === 'dark' || colorTheme.startsWith('dark-') ? 'dark' : 'light';
    document.querySelector('html')?.setAttribute('data-theme', mode);
    document.querySelector('html')?.setAttribute('data-color-theme', colorTheme === 'dark' ? 'dark-dracula' : colorTheme);
  }
`;

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useStore(themeStore);

  useEffect(() => {
    const mode = theme === 'dark' || theme.startsWith('dark-') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-color-theme', theme === 'dark' ? 'dark-dracula' : theme);
  }, [theme]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme={theme === 'dark' || theme.startsWith('dark-') ? 'dark' : 'light'}
      data-color-theme={theme === 'dark' ? 'dark-dracula' : theme}
      className="w-full h-full"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* DAHERI AI TITLE ADD KIYA */}
        <title>DAHERI AI - Apna AI Builder</title>
        <meta name="description" content="DAHERI AI - Apna AI Builder - Build anything with AI" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
      </head>
      <body className="w-full h-full">
        <ClientOnly fallback={<div className="w-full h-full" />}>
          {() => <DndProvider backend={HTML5Backend}>{children}</DndProvider>}
        </ClientOnly>
        <ToastContainer
          closeButton={({ closeToast }) => {
            return (
              <button className="Toastify__close-button" onClick={closeToast}>
                <div className="i-ph:x text-lg" />
              </button>
            );
          }}
          icon={({ type }) => {
            switch (type) {
              case 'success': {
                return <div className="i-ph:check-bold text-bolt-elements-icon-success text-2xl" />;
              }
              case 'error': {
                return <div className="i-ph:warning-circle-bold text-bolt-elements-icon-error text-2xl" />;
              }
            }

            return undefined;
          }}
          position="bottom-right"
          pauseOnFocusLoss
          transition={toastAnimation}
          autoClose={3000}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

import { journeys, observeWebVitals } from './lib/performance/metrics';
import { prebootWebContainer } from './lib/performance/webcontainer-optimizer';
import { logStore } from './lib/stores/logs';
import { themeStore } from './lib/stores/theme';
import globalStyles from './styles/index.scss?url';
import { stripIndents } from './utils/stripIndent';

export default function App() {
  const theme = useStore(themeStore);

  useEffect(() => {
    journeys.appLaunch.start();
    journeys.appLaunch.reactHydrated();

    logStore.logSystem('Application initialized', {
      theme,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    observeWebVitals();
    prebootWebContainer();

    import('./utils/debugLogger')
      .then(({ debugLogger }) => {
        const status = debugLogger.getStatus();
        logStore.logSystem('Debug logging ready', {
          initialized: status.initialized,
          capturing: status.capturing,
          enabled: status.enabled,
        });
      })
      .catch((error) => {
        logStore.logError('Failed to initialize debug logging', error);
      });

    journeys.appLaunch.interactive({
      theme,
      performance: {
        navigation: performance.getEntriesByType('navigation')[0],
      },
    });
  }, []);

  return <Outlet />;
}
