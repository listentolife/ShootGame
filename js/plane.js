

/**
 * @description 继承父类原型对象的函数
 * @param {Object} subType 子类对象
 * @param {Object} subType 父类对象
 */
var inheritPrototype = function (subType, superType) {
  // 把父类对象的原型对象赋值给proto
  var protoType = Object.create(superType.prototype);
  // proto的constructor指向子类对象，进行重置
  protoType.constructor = subType;
  // 把子类的原型指向原型
  subType.prototype = protoType;
}

/**
 * @author listentolife
 * @constructor Plane
 * @description 画布飞机对象
 * @see The <a href="#">Plane</a >.
 * @example 
 * new Plane({
 *    x: 40,        // 图片左上角坐标x轴
 *    y: 40,        // 图片左上角坐标y轴
 *    img: Img,     // 怪兽图片对象
 *    width: 50,    // 图片宽度
 *    height: 50,   // 图片高度 
 *   }, context, speed);
 * @since version 0.1
 * @param {JSON Object} options 图片的信息及初始坐标
 * @param {Object} context 画布环境
 * @param {Number} speed 飞机对象动画速度
 */
function Plane (options, context, speed) {
  /** 
   * @description {JSON Object} options 画布飞机图片对象
   * @field
   */
  this.options = options;
  /** 
   * @description {Object} context 画布环境
   * @field
   */
  this.context = context;
  /** 
   * @description {Number} speed 动画每帧速度
   * @field
   */
  this.speed = speed;
}
/** 
  * @description {Function} drawing 画布上渲染图片
  * @field
  */
Plane.prototype.drawing = function () {
  var options = this.options;
  var context = this.context;
  context.drawImage(options.img, options.x, options.y, options.width, options.height);
}
/** 
  * @description {Function} clearImg 画布上清除图片
  * @field
  */
Plane.prototype.clearImg = function () {
  var options = this.options;
  var context = this.context;
  context.clearRect(options.x, options.y, options.width, options.height);
}
/** 
  * @description {Function} move 修改画布飞机坐标值
  * @field
  */
Plane.prototype.move = function(direction) {
  var speed = this.speed;
  switch(direction)
  {
    case 'left':
      this.options.x -= speed;
      break;
    case 'right':
      this.options.x += speed;
      break;
    case 'down':
      this.options.y += 50;
  }
}