
function Token(color, container) {
   this._sprite = jQuery('<div class="token" />')
                     .addClass(this.color = color)
                     .on('webkitAnimationEnd', Token._onAnimationEnd);
}

Token.prototype.setLeft = function(left) {
   this._sprite.css('left', left);
   return this;
};

Token.prototype.explode = function() {
   this._sprite.addClass('exploding');
   return this;
};

Token.prototype.gameOver = function() {
   this._sprite.removeClass(this.color).addClass('white');
   return this;
};

Token.prototype.getDom = function() {
   return this._sprite;
};

Token._onAnimationEnd = function(e) {
   if(e.originalEvent.animationName == 'token-exploding') {
      this.parentNode.removeChild(this);
   }
};

