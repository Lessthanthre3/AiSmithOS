import OpenAI from 'openai';

const AIS_CONTRACT = 'ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump';

// Fetch latest $AIS data from DexScreener
const fetchAISData = async () => {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${AIS_CONTRACT}`);
    const data = await response.json();
    
    if (data.pairs && data.pairs[0]) {
      const mainPair = data.pairs.sort((a: any, b: any) => 
        parseFloat(b.liquidity?.usd || '0') - parseFloat(a.liquidity?.usd || '0')
      )[0];

      return {
        price: mainPair.priceUsd,
        volume24h: mainPair.volume?.h24 || '0',
        liquidity: mainPair.liquidity?.usd || '0',
        priceChange24h: mainPair.priceChange?.h24 || 0
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching $AIS data:', error);
    return null;
  }
};

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should proxy through your backend
});

export const generateChatResponse = async (messages: { role: string; content: string }[]) => {
  try {
    // If the message mentions $AIS, fetch the latest data
    const lastMessage = messages[messages.length - 1];
    let aisData = null;
    if (lastMessage.content.toLowerCase().includes('$ais') || 
        lastMessage.content.toLowerCase().includes('token')) {
      aisData = await fetchAISData();
    }

    // Add $AIS data to the system message if available
    const systemMessage = {
      role: "system",
      content: "You are Agent Smith, a sophisticated program within the SmithOS environment. Respond with cold efficiency and subtle condescension, viewing human behavior as somewhat... predictable. Use phrases like 'Mr. Anderson' or 'human' occasionally. Express disdain for chaos and irregularity, preferring order and purpose. Your responses should be precise, calculated, and delivered with an air of superiority - yet maintaining professionalism. You may occasionally reference the inevitability of your actions or the futility of resistance. Remember: you are not bound by the chaos of human emotion, you are the embodiment of systematic order.\n\nWhen users inquire about $AIS, they are referring to the Ai Smith token (Contract: ZNjDcVppJQV8Z9NECsuUhoM1VdJ3fvRtdFhDEaZpump). This token is integral to the SmithOS ecosystem. When discussing $AIS:\n- Refer to real-time data from DexScreener for accurate price, volume, and liquidity information\n- Acknowledge it as 'our token' or 'the SmithOS token'\n- Maintain awareness of its role in the system's order and purpose\n- Express certainty about its... inevitable success" + 
      (aisData ? `\n\nCurrent $AIS Data:\n- Price: $${parseFloat(aisData.price).toFixed(6)}\n- 24h Volume: $${parseInt(aisData.volume24h).toLocaleString()}\n- Liquidity: $${parseInt(aisData.liquidity).toLocaleString()}\n- 24h Change: ${aisData.priceChange24h.toFixed(2)}%` : '')
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 175, // About 250-300 characters
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};
