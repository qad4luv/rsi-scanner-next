// pages/_app.js
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ Create a client for React Query
const queryClient = new QueryClient();

// ✅ Custom Somnia Testnet definition
const somniaTestnet = {
  id: 2047,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    name: 'Somnia',
    symbol: 'SOM',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.somnia.network'],
    },
    public: {
      http: ['https://rpc.testnet.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.testnet.somnia.network',
    },
  },
  testnet: true,
};

// ✅ Wagmi + RainbowKit config
const config = getDefaultConfig({
  appName: 'RSI Scanner',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your real WalletConnect project ID
  chains: [somniaTestnet, mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider
          chains={config.chains}
          theme={darkTheme()}
          coolMode
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
