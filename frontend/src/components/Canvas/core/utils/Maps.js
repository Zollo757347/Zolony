class Maps extends null {
  /**
   * @type {[import("./parseTexture").SixSides, [number, number, number]][]}
   */
  static P6DArray = [
    ['west', [-1, 0, 0]], 
    ['east', [1, 0, 0]], 
    ['down', [0, -1, 0]], 
    ['up', [0, 1, 0]], 
    ['north', [0, 0, -1]], 
    ['south', [0, 0, 1]]
  ];

  /**
   * @type {[import("./parseTexture").SixSides, [number, number, number]][]}
   */
  static S6DArray = [
    ['down', [0, -1, 0]], 
    ['up', [0, 1, 0]], 
    ['north', [0, 0, -1]], 
    ['south', [0, 0, 1]], 
    ['west', [-1, 0, 0]], 
    ['east', [1, 0, 0]]
  ];


  /**
   * @type {Map<import("./parseTexture").SixSides, [number, number, number]>}
   */
  static P6DMap = new Map(Maps.P6DArray);

  /**
   * @type {Map<import("./parseTexture").SixSides, [number, number, number]>}
   */
  static S6DMap = new Map(Maps.S6DArray);
}

export default Maps;