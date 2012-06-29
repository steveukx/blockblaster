
function Column(left, maxTokens) {
   this.left = left;
   this._tokens = [];
   this._fire = [];
   this._maxTokens = maxTokens;
}

/**
 *
 * @param token
 * @param {Boolean} [toEnd=false]
 */
Column.prototype.pushToken = function(token, toEnd) {
   if(toEnd) {
      this._tokens.push(token.setLeft(this.left));
   }
   else {
      this._tokens.unshift(token.setLeft(this.left));
      this._tokens.forEach(function(token) {
         token.shunt();
      });
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

   var bottom = (this._tokens.length + 0) * this._tokens[0].height;
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
            this.pushToken(new Token(this._tokens[0].height, fire.color, Game.container)
               .setTop(bottom), true);
         }
      }
   }.bind(this));
};
