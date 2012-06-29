
function Column(left, maxTokens, container) {
   this.left = left;
   this._tokens = [];
   this._fire = [];
   this._maxTokens = maxTokens;
   this._sprite = jQuery('<div class="column"></div>').css('left', left).appendTo(container);
}

/**
 *
 * @param {String} color
 * @param {Boolean} [toEnd=false]
 */
Column.prototype.pushToken = function(color, toEnd) {
   var token = new Token(color);

   if(toEnd) {
      this._tokens.push(token);
      this._sprite.append(token.getDom());
   }
   else {
      this._tokens.unshift(token);
      this._sprite.prepend(token.getDom());
   }

   if(this._tokens.length >= this._maxTokens) {
      Game.fire('game.over', this);
      this._tokens.forEach(function(token) {
         token.gameOver();
      });
   }
};

/**
 *
 * @param token
 */
Column.prototype.pushFire = function(fire) {
   this._fire.push(fire);
   fire.on('died', this.dropFire, this);
   return this;
};

/**
 *
 * @param fire
 */
Column.prototype.dropFire = function(fire) {
   var index = this._fire.indexOf(fire);
   if(index >= 0) {
      this._fire.splice(index, 1);
   }
   return this;
};

/**
 *
 */
Column.prototype.detectCollisions = function() {
   if(!this._fire.length || !this._tokens.length) return;

   var bottom = (this._tokens.length + 0) * Game.ROW_HEIGHT;
   this._fire.forEach(function(fire) {
      if(fire.getTop() <= bottom) {
         this.dropFire(fire.explode(bottom));

         if(fire.color == this._tokens[this._tokens.length - 1].color) {
            var token;
            while((token = this._tokens[this._tokens.length - 1]) && token.color == fire.color) {
               this._tokens.pop().explode();
            }
         }
         else {
            this.pushToken(fire.color, true);
         }
      }
   }.bind(this));
};
