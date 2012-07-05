
function Column(left, maxTokens, container, index) {
   this.left = left;
   this.index = index;
   this._tokens = [];
   this._fire = [];
   this._maxTokens = maxTokens;
   this._sprite = jQuery('<div class="column"></div>').css('left', left).appendTo(container);

   Game.on('token.explode', this._onTokenExploded, this);
   Game.on('game.over', this._onGameOver, this);
}

/**
 *
 * @param {String} color
 * @param {Boolean} [toEnd=false]
 */
Column.prototype.pushToken = function(color, toEnd) {
   var token = new Token(color),
       newTokenCount = this._tokens.length + 1;

   if(toEnd) {
      this._tokens.push(token);
      this._sprite.append(token.getDom());
   }
   else {
      this._tokens.unshift(token);
      this._sprite.prepend(token.getDom());
   }

   if(newTokenCount >= this._maxTokens) {
      Game.fire('game.over', this);
   }

   else if(toEnd && newTokenCount > 1) {
      if(this._tokens[newTokenCount - 1].color === this._tokens[newTokenCount - 2].color) {
         this.destroyTokens(newTokenCount - 1);
      }
   }

   return token;
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
   if(!fire.isCollision) {
      this.pushToken(fire.color, true);
   }
   return this;
};

Column.prototype._onGameOver = function(column) {
   this._sprite.toggleClass('column-error', column === this);
};

Column.prototype._onTokenExploded = function(token, tokenIndex, column) {
   var columnDistance = column.index - this.index;
   if(Math.pow(columnDistance, 2) === 1) {
      if(this._tokens.length > tokenIndex && this._tokens[tokenIndex].color === token.color) {
         console.log('Linked destroy: ', ['originator:' + column.index, 'target:' + this.index, 'row:' + tokenIndex, 'color:' + token.color])
         this.destroyTokens(tokenIndex);
      }
   }
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
         this.pushToken(fire.color, true);
      }
   }.bind(this));
};

Column.prototype.destroyTokens = function(fromIndex) {
   var color = this._tokens[fromIndex].color,
       min = fromIndex,
       max = fromIndex;

   for(var i = fromIndex; i >= 0; i--) {
      if(this._tokens[i].color === color) {
         min = i;
      }
      else {
         break;
      }
   }

   for(var i = fromIndex, l = this._tokens.length; i < l; i++) {
      if(this._tokens[i].color === color) {
         max = i;
      }
      else {
         break;
      }
   }

   var tokens = this._tokens.splice(min, max - min + 1);
   for(var i = 0, l = tokens.length; i < l; i++) {
      tokens[i].explode();


      console.log('Destroy: ', ['originator:' + this.index, 'row:' + (min + i)])
      Game.fire('token.explode', tokens[i], min + i, this);
   }
};

