import RSISignalLoggerABI from '@/contracts/RSISignalLoggerABI.json';
import { getContract } from 'wagmi/actions';
import { useConfig } from 'wagmi';

const CONTRACT_ADDRESS = '0x1C0BC6f02f3160776906FCdefb7f2df0DAe2DB8F';

export function useRSISignalContract() {
  const config = useConfig();

  return getContract({
    address: CONTRACT_ADDRESS,
    abi: RSISignalLoggerABI,
    config,
  });
}
