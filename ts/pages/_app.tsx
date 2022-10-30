import type { AppProps } from 'next/app';
import 'reflect-metadata';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
