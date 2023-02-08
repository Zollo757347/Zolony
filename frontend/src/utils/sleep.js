/**
 * 回傳一個需要 ms 毫秒才會 resolve 的 Promise
 * @template T
 * @param {number} ms 
 * @param {T} value 最後 resolve 的值
 * @returns {Promise<T>}
 */
function sleep(ms, value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

export default sleep;