# 📈 RSI Scanner Dapp on Somnia Testnet

This is a Web3-enabled RSI Scanner that identifies **overbought** and **oversold** tokens on Bybit Futures across selected timeframes. It lets connected wallet users log RSI signals **on-chain** to a smart contract deployed on the **Somnia Testnet**.

---

## 🔧 Features

- ✅ Wallet connection via **RainbowKit** + **Wagmi v2**
- 📊 Fetches RSI signals for timeframes (1m–1d)
- 🔔 Notifies when new signals appear
- 🔗 Logs signals to a smart contract on the **Somnia Testnet**
- 🌐 Fully decentralized frontend (Next.js)

---

## 🚀 Live Demo

Coming soon...

---

## 🛠 Tech Stack

- Next.js
- Tailwind CSS
- Wagmi v2 + RainbowKit
- Web3.js (via Wagmi hooks)
- Somnia Blockchain Testnet
- Smart Contract: Solidity (ERC20-style signal logger)

---

## ⚙️ Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/qad4luv/rsi-scanner-next
cd rsi-scanner-next
````

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment (optional)**
   Set up environment variables in `.env.local` (if needed for future API keys).

4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔗 Smart Contract

* **Name:** `RSISignalLogger`
* **Network:** Somnia Testnet
* **Address:** `0x1C0BC6f02f3160776906FCdefb7f2df0DAe2DB8F`
* **Explorer:** [shannon-explorer.somnia.network](https://shannon-explorer.somnia.network)

---

## 🧠 How It Works

1. The backend API fetches Bybit Futures RSI data.
2. If tokens are overbought (RSI > 70) or oversold (RSI < 30), they appear in the UI.
3. The user can connect their wallet and log those signals on-chain.
4. Transactions are sent to the Somnia smart contract and can be viewed on the block explorer.

---

## 📁 Project Structure

```bash
/pages
  index.js          # Main UI logic
  api/scan.js       # API route for fetching RSI data
/contracts
  RSISignalLoggerABI.json
/hooks
  useLogSignal.js   # Hook to log signals on-chain
/styles
  globals.css
```

---

## ✅ To-Do / Improvements

* Add sparkline charts for price trends
* Add Telegram/email notifications
* Deploy to Vercel or IPFS
* Add ability to view logged signals from the blockchain

---

## 🧑‍💻 Author

Made with ❤️ by [@qad4luv](https://github.com/qad4luv)

---

## 📄 License

MIT

```

---


```
