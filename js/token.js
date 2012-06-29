
function Token(height, color, container) {
   this.height = height;
   this.top = 0 - height;
   this._sprite = jQuery('<div class="token" />')
                     .css('top', this.top)
                     .addClass(this.color = color).appendTo(container).get(0);
}

Token.prototype.top = 0;

Token.prototype.height = 0;

Token.prototype.shunt = function() {
   this._sprite.style.top = (this.top += this.height) + 'px';
};

Token.prototype.setTop = function(top) {
   this._sprite.style.top = (this.top = top) + 'px';
   return this;
};

Token.prototype.setLeft = function(left) {
   this._sprite.style.left = left + 'px';
   return this;
};

Token.prototype.explode = function() {
   Game.fire('token.explode', this);
   this._sprite.parentNode.removeChild(this._sprite);
   return this;
};

Token.prototype.gameOver = function() {
   this._sprite.classList.remove(this.color);
   this._sprite.classList.add('white');

   return this;
};

