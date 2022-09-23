import LinkableChains from 'config/LinkableChains';

/* A constant that is used to find the desmos chain from the LinkableChains array. */

export const DESMOS_PREFIX = 'desmos';
/* Finding the desmos chain from the LinkableChains array. */

function desmosChain() {
  const chain = LinkableChains.find(c => c.prefix === DESMOS_PREFIX);
  if (!chain) throw new Error('Desmos chain not found');
  return chain;
}

export default desmosChain;
