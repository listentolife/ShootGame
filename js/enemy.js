


/**
 * @author listentolife
 * @constructor Monster
 * @description 画布怪兽对象，继承飞机对象
 * @see The <a href="#">Monster</a >.
 * @example 
 * new Monster({
 *    x: 40,        // 图片左上角坐标x轴
 *    y: 40,        // 图片左上角坐标y轴
 *    img: Img,     // 怪兽图片对象
 *    width: 50,    // 图片宽度
 *    height: 50,   // 图片高度
 *    boomImg: bImg // 爆炸图片对象
 *   }, context, enemySpeed);
 * @since version 0.1
 * @param {JSON Object} options 怪兽图片跟爆炸图片的信息及初始坐标
 * @param {Object} context 画布环境
 * @param {Number} speed 怪兽对象动画速度
 */
function Monster (options, context, speed) {
  // 继承父类Plane的属性
  Plane.call(this, options, context, speed);
  /** 
   * @description {Boolean} isLive 怪兽存活真假值，初始值为真
   * @field
   */
  this.isLive = true;
}
// 继承父类Plane的原型
inheritPrototype(Monster, Plane);
/** 
  * @description {Function} drawing 【复用重写】画布上渲染图片
  * @field
  */
Monster.prototype.drawing = function () {
  var options = this.options;
  var context = this.context;
  // 判断怪兽对象是否存活，是则渲染怪兽图片，否则渲染爆炸图片
  if (this.isLive) {
    context.drawImage(options.img, options.x, options.y, options.width, options.height);
  } else {
    context.drawImage(options.boomImg, options.x, options.y, options.width, options.height);
  }
}