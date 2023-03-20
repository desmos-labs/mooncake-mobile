/**
 * Allows to sleep the current execution for the provided amount of milliseconds.
 * @param ms {number} - Milliseconds for which to sleep
 */
const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export default sleep;
