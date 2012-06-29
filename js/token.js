
function Token(color, container) {
   this._sprite = jQuery('<div class="token" />').addClass(this.color = color);
}

Token.prototype.setLeft = function(left) {
   this._sprite.css('left', left);
   return this;
};

Token.prototype.explode = function() {
   Game.fire('token.explode', this);
   this._sprite.remove();
   return this;
};

Token.prototype.gameOver = function() {
   this._sprite.removeClass(this.color).addClass('white');
   return this;
};

Token.prototype.getDom = function() {
   return this._sprite;
};

