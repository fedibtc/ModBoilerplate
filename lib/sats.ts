export const satsForTokens = (tokens: number) => {
  return Math.max(1, Math.floor(tokens / 20));
};

export const tokensForSats = (sats: number) => {
  // 4096 is the max amount of completion tokens allowed by OpenAI's gpt-3.5-turbo models
  return Math.min(Math.max(Math.ceil(sats * 20), 0), 4096);
};
