import React, { useCallback, Suspense, useEffect } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import LegacyContainer from '@/container/legacy';
import NavReshuffleContainer from '@/container/nav-reshuffle';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import { ProductNavReshuffleProvider } from '@/core/product-nav-reshuffle';
import { ProgressProvider } from '@/context/progress';
import CookiePolicy from '@/cookie-policy/CookiePolicy';
import SSOAuthModal from '@/sso-auth-modal/SSOAuthModal';
import LiveChat from '@/components/LiveChat';

export default function Container(): JSX.Element {
  const {
    isLoading,
    betaVersion,
    useBeta,
    chatbotOpen,
    chatbotReduced,
    setChatbotReduced,
  } = useContainer();
  const shell = useShell();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const language = environment.getUserLanguage();
  const { ovhSubsidiary } = environment.getUser();

  const isNavReshuffle = betaVersion && useBeta;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const tracking = shell.getPlugin('tracking');
    tracking.waitForConfig().then(() => {
      if (isNavReshuffle && [1, 2].includes(betaVersion)) {
        tracking.trackMVTest({
          test: '[product-navigation-reshuffle]',
          waveId: 1,
          creation: `[${betaVersion === 1 ? 'full' : 'customer'}-services]`,
        });
      }
    });
    if (isNavReshuffle) {
      shell.getPlugin('ux').showMenuSidebar();
    }
  }, [isLoading]);

  const reduceLiveChatHandler = useCallback(() => {
    setChatbotReduced(true);
  }, [setChatbotReduced]);

  const closeLiveChatHandler = useCallback(() => {
    shell.getPlugin('ux').closeChatbot();
  }, [shell]);

  return isLoading ? (
    <></>
  ) : (
    <>
      <ProgressProvider>
        {isNavReshuffle ? (
          <ProductNavReshuffleProvider>
            <NavReshuffleContainer />
          </ProductNavReshuffleProvider>
        ) : (
          <>
            <LegacyContainer />
          </>
        )}
        <LiveChat
          language={language}
          subsidiary={ovhSubsidiary}
          open={chatbotOpen}
          reduced={chatbotReduced}
          onReduce={reduceLiveChatHandler}
          onClose={closeLiveChatHandler}
          style={{ position: 'absolute' }}
        ></LiveChat>
      </ProgressProvider>

      <Suspense fallback="">
        <SSOAuthModal />
      </Suspense>
      <Suspense fallback="...">
        <CookiePolicy shell={shell} />
      </Suspense>
    </>
  );
}
