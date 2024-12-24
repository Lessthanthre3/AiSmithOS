interface TokenProfile {
  name: string;
  symbol: string;
  address: string;
  network: string;
  totalSupply?: string;
  decimals?: number;
  marketCap?: number;
  priceUsd?: number;
  volume24h?: number;
}

export const AIS_CONTRACT_ADDRESS = 'ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump';

export async function fetchTokenProfile(): Promise<TokenProfile | null> {
  try {
    const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
    const data = await response.json();
    
    // Find our token in the profiles
    const aisProfile = data.profiles?.find(
      (profile: any) => profile.address.toLowerCase() === AIS_CONTRACT_ADDRESS.toLowerCase()
    );

    if (!aisProfile) {
      console.warn('AIS token profile not found in DexScreener data');
      return null;
    }

    return {
      name: aisProfile.name,
      symbol: aisProfile.symbol,
      address: aisProfile.address,
      network: aisProfile.network,
      totalSupply: aisProfile.totalSupply,
      decimals: aisProfile.decimals,
      marketCap: aisProfile.marketCap,
      priceUsd: aisProfile.priceUsd,
      volume24h: aisProfile.volume24h
    };
  } catch (error) {
    console.error('Error fetching token profile:', error);
    return null;
  }
}
