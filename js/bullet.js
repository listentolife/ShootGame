

// 子弹对象
/**
 * @author listentolife
 * @constructor Bullet
 * @description 画布怪兽对象
 * @see The <a href="#">Monster</a >.
 * @example 
 * new Monster({
 *    x: 40,        // 子弹左上角坐标x轴
 *    y: 40,        // 子弹左上角坐标y轴
 *   }, context, bulletSpeed);
 * @since version 0.1
 * @param {JSON Object} options 子弹的初始头坐标
 * @param {Object} context 画布环境
 * @param {Number} speed 子弹对象动画速度
 */
 function Bullet (options, context, speed) {
  // 继承父类Plane的属性
  Plane.call(this, options, context, speed);
}
/** 
  * @description {Function} drawing 画布上渲染子弹
  * @field
  */
Bullet.prototype.drawing = function () {
  var options = this.options;
  var context = this.context;
  context.beginPath();
  context.strokeStyle = 'white';
  context.moveTo(options.x, options.y);
  context.lineTo(options.x, options.y + CONFIG.bulletSize);
  context.stroke();
}
/** 
  * @description {Function} clearImg 画布上清除子弹
  * @field
  */
Bullet.prototype.clear = function () {
  var options = this.options;
  var context = this.context;
  context.clearRect(options.x, options.y, 1, CONFIG.bulletSize);
}
/** 
  * @description {Function} animate 子弹动画
  * @field
  */
Bullet.prototype.animate = function (){
  this.clear();
  // 判断子弹是否到达画布上方，是则清除不再渲染，否则移动坐标并渲染
  if(this.options.y > 0) {
    this.options.y -= this.speed;
    requestAnimationFrame(this.animate.bind(this));
  } else {
    this.clear();
  }
}