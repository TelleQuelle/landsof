// client/src/utils/web3.js
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Настройка сети Solana (используем devnet для разработки, mainnet-beta для продакшена)
export const network = WalletAdapterNetwork.Devnet;
export const endpoint = clusterApiUrl(network);
export const connection = new Connection(endpoint);

// Получение доступных провайдеров кошельков
export const getWalletProviders = () => {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];
};

// Проверка, что кошелек подключен
export const isWalletConnected = (wallet) => {
  return wallet && wallet.connected && wallet.publicKey;
};

// Получение сокращенного адреса кошелька для отображения
export const getShortAddress = (publicKey) => {
  if (!publicKey) return '';
  const address = publicKey.toString();
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Проверить, является ли пользователь администратором
export const isAdmin = (publicKey, adminAddresses) => {
  if (!publicKey) return false;
  const address = publicKey.toString();
  return adminAddresses.includes(address);
};

// Преобразование строкового адреса в PublicKey
export const stringToPublicKey = (address) => {
  try {
    return new PublicKey(address);
  } catch (error) {
    console.error('Invalid address format', error);
    return null;
  }
};

// Адреса администраторов (замените на реальные адреса)
export const ADMIN_ADDRESSES = [
  // Добавьте сюда публичные ключи администраторов
  'HVMaVhxKX6dLP1yLnkzH3ikRgDG1vqn2zP9PcXuYvZZH'
];