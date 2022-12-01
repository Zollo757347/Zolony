class Utils extends null {
  /**
   * 遞迴地比較兩個變數是否完全相等，對於物件僅考慮可枚舉的屬性
   * @param {any} thing1
   * @param {any} thing2
   */
  static StrictEqual(thing1, thing2) {
    if (typeof thing1 === 'number' && typeof thing2 === 'number' && isNaN(thing1) && isNaN(thing2)) {
      return true;
    }
    if (typeof thing1 !== 'object' || typeof thing2 !== 'object') {
      return thing1 === thing2;
    }

    if (Object.keys(thing1).length !== Object.keys(thing2).length) {
      return false;
    }
    for (const key in thing1) {
      if (!this.StrictEqual(thing1[key], thing2[key])) {
        return false;
      }
    }
    return true;
  }
}

export default Utils;