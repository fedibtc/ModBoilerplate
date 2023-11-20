export const satsForTokens = (tokens: number) => {
  return Math.max(1, Math.floor(tokens / 20));
};

export const tokensForSats = (sats: number) => {
  return Math.ceil(sats * 20);
}

