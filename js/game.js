
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

Game.pointerTouchEvent = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';

Game.container.on(Game.pointerTouchEvent, function(e) {
   if(!Game.running) return;

   var offsetX = e.offsetX;
   var offsetY = e.offsetY;
   if(e.originalEvent.touches) {
      var gameContainerPosition = Game.container.position();
      offsetX = e.originalEvent.touches[0].pageX - gameContainerPosition.left;
      offsetY = e.originalEvent.touches[0].pageY - gameContainerPosition.top;
   }
   this.fire('interaction.clicked', offsetX, offsetY);
   this.fire('interaction.pointermoved', offsetX, offsetY);
}.bind(Game));

Game.container.on('mousemove', function(e) {
   if(!Game.running) return;

   this.fire('interaction.pointermoved', e.offsetX, e.offsetY);
}.bind(Game));

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
Game.nextColor = Game.colors[Number.rand(0,3)];

Game.on('fire', function() {
   var oldColor = this.nextColor;
   this.nextColor = Game.colors[Number.rand(0,3)];

   Game.fire('colorchanged', this.nextColor, oldColor);
}, Game);

Game.on('interaction.clicked', function() { console.log(arguments); });

Game.on('game.over', function() { this.running = false; }, Game);

Game.on('token.explode', function() { this.pushScore(100); }, Game);
