import 'reflect-metadata';

import { NextUIProvider } from '@nextui-org/react';
import { AppProps } from 'next/app';

function TollCalculatorApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default TollCalculatorApp;
