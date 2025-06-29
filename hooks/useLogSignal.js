import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import RSISignalLoggerABI from '@/contracts/RSISignalLoggerABI.json';

const CONTRACT_ADDRESS = '0x1C0BC6f02f3160776906FCdefb7f2df0DAe2DB8F';

export const useLogSignal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const logSignal = async (symbol, rsi, overbought) => {
    try {
      setIsLoading(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: RSISignalLoggerABI,
        functionName: 'logSignal',
        args: [symbol, rsi, overbought],
      });
      await tx.wait();
      console.log('✅ Signal logged:', symbol, rsi, overbought);
    } catch (err) {
      console.error('❌ Failed to log signal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logSignal, isLoading };
};
