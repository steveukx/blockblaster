
var Game = new Subscribable();

Game.COLUMN_WIDTH = 40;

Game.COLUMN_COUNT = 8;

Game.ROW_HEIGHT = 20;

Game.ROW_COUNT = 18;

Game.colors = [
   'red', 'blue', 'green', 'yellow'
];

Game.score = 0;

Game.running = true;

/**
 *
 * @type {jQuery}
 */
Game.container = jQuery('#game');

Game.containerPosition = Game.container.position();

Game.pointerTouchEvent = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';

Game.container.on(Game.pointerTouchEvent + ' mousemove', function(e) {
   if(!Game.running) return;

   var pageX = (e.originalEvent.touches ? e.originalEvent.touches[0] : e).pageX;
   var left = Game.getColumnForLeft(pageX - Game.containerPosition.left).left + (Game.COLUMN_WIDTH / 2);

   if(e.type != 'mousemove') {
      Game.fire('interaction.clicked', left);
   }
   Game.fire('interaction.pointermoved', left);
});

/**
 *
 * @param {Number} score
 */
Game.pushScore = function(score) {
   var lastCall = Game.pushScore.lastCall;
   Game.pushScore.lastCall = Date.now();

   var lastCallGap = Game.pushScore.lastCall - lastCall;

   if(lastCallGap < 250) score *= 1.5;
   else if(lastCallGap < 500) score *= 1.4;
   else if(lastCallGap < 750) score *= 1.3;
   else if(lastCallGap < 1000) score *= 1.2;
   else if(lastCallGap < 1250) score *= 1.1;

   var oldScore = this.score;
   this.fire('game.score', this.score = this.score + score, oldScore);
};
Game.pushScore.lastCall = 0;

/**
 *
 * @param {Number} fromLeft
 * @return {Number}
 */
Game.getColumnOffsetForX = function(fromLeft) {
   return Math.floor(fromLeft / Game.COLUMN_WIDTH) * Game.COLUMN_WIDTH;
};

/**
 *
 * @param {Number} fromLeft
 * @return {Column}
 */
Game.getColumnForLeft = function(left) {
   return this.columns[Math.floor(left / Game.COLUMN_WIDTH)];
};

/**
 * Each of the columns that will contain tokens
 * @type {Column[]}
 */
Game.columns = (function() {
   var columns = [];
   for(var columnIndex, i = Game.COLUMN_COUNT; columnIndex = Game.COLUMN_COUNT - i, i--;) {
      columns.push(new Column(Game.COLUMN_WIDTH * columnIndex, Game.ROW_COUNT, Game.container, columnIndex));
   }
   return columns;
}());

/**
 *
 * @type {String}
 */
Game.nextColor = Game.colors.rand();

Game.nextColors = (function() {
   var nextColors = [];
   for(var i = 5; --i;) {
      nextColors.push(Game.colors.rand());
   }
   return nextColors;
}());

Game.on('fire', function() {
   var oldColor = this.nextColor;
   this.nextColor = Game.nextColors.pop();

   Game.fire('colorchanged', this.nextColor, oldColor);
   Game.nextColors.unshift(Game.colors.rand());
}, Game);

Game.on('interaction.clicked', function() { console.log(arguments); });

Game.on('game.over', function() {
   this.running = false;
   Game.container.addClass('game-over');
}, Game);

Game.on('token.explode', function() { this.pushScore(100); }, Game);
