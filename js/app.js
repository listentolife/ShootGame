


// 画布
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// 元素
var container = document.getElementById('game');








/**
 * 整个游戏对象
 */
var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */

  init: function(opts) {
    this.status = 'start';
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    var playAgainBtn = document.querySelector('.js-next');
    var playResetBtn = document.querySelectorAll('.js-replay');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
    playAgainBtn.onclick = function() {
      self.play();
    };
    playResetBtn[0].onclick = function() {
      self.play();
    };
    playResetBtn[1].onclick = function() {
      self.play();
    };
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    var self = this;
    self.setStatus('playing');
    // 分数
    self.score = 0;
    // 怪兽层数
    self.mLayer = 1;
    // 怪兽图片
    self.mImg = new Image();
    self.mImg.src = CONFIG.enemyIcon;
    // 爆炸图片
    self.boomImg = new Image();
    self.boomImg.src = CONFIG.enemyBoomIcon;
    //飞机图片
    self.pImg = new Image();
    self.pImg.src = CONFIG.planeIcon;
    //怪兽初始移动方向
    self.mDirection = CONFIG.enemyDirection;
    // 怪兽军团
    self.monsters = [];
    // 子弹群
    self.bullets = [];
    // 画出怪兽，飞机
    self.createObject();
    // 画布运动
    self.animate();
    // 键盘事件监听（左右键移动，空格键子弹发射）
    document.onkeydown = function(e) {
      //飞机移动
      var key = e.keyCode || e.which || e.charCode;
      switch(key) {
        // 点击左方向键
        case 37: 
          if(self.plane.options.x - CONFIG.planeSpeed > CONFIG.canvasPadding) {
            self.plane.move('left');
          }
          break;
        // 点击右方向键
        case 39: 
          if(self.plane.options.x + self.plane.options.width + CONFIG.planeSpeed < 670) {
            self.plane.move('right');
          }
          break;
        // 点击空格键
        case 32:
          var bulletX = self.plane.options.x + self.plane.options.width / 2;
          var bulletY = self.plane.options.y;
          bullet = new Bullet({
            x: bulletX,
            y: bulletY
          }, context, CONFIG.bulletSpeed);
          self.bullets.push(bullet);
          // bullet.drawing();
          bullet.animate();
      }
    };
    // 碰撞测试
  },
  createObject: function() {
    // 子弹群置空
    this.bullets = [];
    // 创建怪兽军团跟画出飞机
    this.plane = new Plane({
      x: 320, 
      y: 470, 
      img: this.pImg, 
      width: CONFIG.planeSize.width, 
      height: CONFIG.planeSize.height
    }, context, CONFIG.planeSpeed);
    this.plane.drawing();
    // 难度调整
    if (CONFIG.level < 3) {
      this.mLayer = CONFIG.level;
    } else {
      this.mLayer = 3;
      enemySpeed: CONFIG.enemySpeed * 2;
    }
    for (let j = 0; j < this.mLayer; j++) {
      for (let i = 0; i < CONFIG.numPerLine; i++) {
      // 每一个怪兽的坐标x = 上一只怪兽左上角坐标x + 怪兽宽度50 + 间距10
      var monsterX = 40 + i * (CONFIG.enemySize + CONFIG.enemyGap);
      var monsterY = 30 + j * (CONFIG.enemySize + CONFIG.enemyGap);
      var monster = new Monster({
        x: monsterX, 
        y: monsterY, 
        img: this.mImg, 
        width: CONFIG.enemySize, 
        height: CONFIG.enemySize, 
        boomImg: this.boomImg
      }, context, CONFIG.enemySpeed);
      monster.drawing();
      this.monsters.push(monster);
      }
    }
    
  },
  animate: function() {
    var self = this;
    var len = this.monsters.length;
    switch(this.mDirection)
    {
      case 'right':
        var lastMonster = this.monsters[len - 1]; 
        // 判断怪兽军团是否到达运动区域的最右边，是则向下一层，否则继续向右移动
        if (lastMonster.options.x + lastMonster.options.width >= (canvas.width - CONFIG.canvasPadding)) {
          this.mDirection = 'left';
          for(let i = 0; i < len; i++) {
            this.monsters[i].move('down');
          }
        } else {
          for(let i = 0; i < len; i++) {
            this.monsters[i].move(this.mDirection);
          }
        }
        break;
      case 'left':
        // 获取最右边怪兽的x坐标
        var monstersX = 700;
        this.monsters.forEach(function (monster) {
          if (monster.options.x < monstersX) {
            monstersX = monster.options.x;
          }
        });
        // 判断怪兽军团是否到达运动区域的最左边，是则向下一层，否则继续向左移动
        if (monstersX - CONFIG.enemySpeed <= CONFIG.canvasPadding) {
          for(let i = 0; i < len; i++) {
            this.monsters[i].move('down');
          }
          this.mDirection = 'right';
        } else {
          for(let i = 0; i < len; i++) {
            this.monsters[i].move(this.mDirection);
          }
        }
        break;
    }
    // 做碰撞检测
    this.collision();
    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 重新渲染画布
    this.drawOject();
    // 获取怪兽军团最下方怪兽的坐标y
    var monstersY = 0;
    this.monsters.forEach(function (monster) {
      if (monster.options.y > monstersY) {
        monstersY = monster.options.y;
      }
    });
    // 判断怪兽是否被打完
    if (this.score === CONFIG.numPerLine * this.mLayer) {
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (CONFIG.level === CONFIG.totalLevel) {
        this.setStatus('all-success');
        // 重置等级
        CONFIG.level = 1;
      } else {
        this.setStatus('success');
        // 显示等级
        var level = document.getElementsByClassName('game-next-level');
        level[0].innerText = '当前Level: ' + CONFIG.level++;
      }
    } else if (monstersY < 410) {
      requestAnimationFrame(self.animate.bind(self));
    } else {
      
      this.monsters = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.setStatus('failed');
      // 重置等级
      CONFIG.level = 1;
      var finalScore = document.getElementsByClassName('score');
      finalScore[0].innerText = this.score;
    }
  },
  drawOject: function() {
    var self = this;
    //渲染画布
    for(let i = 0; i < this.monsters.length; i++) {
      this.monsters[i].drawing();
      if(!this.monsters[i].isLive) {
        this.monsters.splice(i, 1);
      }
    }
    this.plane.drawing();
    if(this.bullets.length > 0) {
      this.bullets.forEach(function (bullet, index) {
        // 判断子弹是否已经达到顶部，是则清出子弹群，否则继续渲染
        if(bullet.options.y > 0){
          bullet.drawing();
        } else {
          self.bullets.splice(index, 1);
        }
      });
    }
    // 分数统计
    this.score = CONFIG.numPerLine * this.mLayer - this.monsters.length;
    var scoreText = "分数:" + this.score;
    context.fillStyle = 'white';
    context.font = '18px SimHei';
    context.fillText(scoreText, 20, 30);
  },
  collision: function() {
    // 碰撞测试
    var len = this.bullets.length;
    var firstMonster = this.monsters[0];
    var fMonsterY = firstMonster.options.y;
    for(let i = 0; i < len; i++) {
      var bulletY = this.bullets[i].options.y;
      if(!(bulletY > fMonsterY + CONFIG.enemySize || bulletY + CONFIG.bulletSize < fMonsterY)) {
        // 如果子弹进入怪兽区域，则开始检测是否出现碰撞
        var mLen = this.monsters.length;
        var bulletX = this.bullets[i].options.x;
        for(let j = 0; j < mLen; j++) {
          var monsterX = this.monsters[j].options.x;
          if(bulletX > monsterX && bulletX < monsterX + CONFIG.enemySize) {
            // 如果子弹的x轴在怪兽内，则子弹击中怪兽
            this.monsters[j].isLive = false;
            this.bullets.splice(i, 1);
            /* 正常来说，因为子弹的发射是有先后顺序的，如果能判定一颗子弹跟怪兽发生碰撞，
             * 后一颗不会跟怪兽发生碰撞，最可能就是前后帧都发生碰撞，所以判定一颗有碰撞，
             * 即可跳出循环
             */
            break;
          }
        }
        // 同上碰撞理解，操作上不会出现同时两次碰撞，所以直接跳出循环
        break;
      }
    }
  }
};


// 初始化
GAME.init();
