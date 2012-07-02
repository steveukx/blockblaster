
function Fire(container, color, columnLeft) {
   this._sprite = jQuery('<div class="fire"></div>')
                     .addClass(this.color = color)
                     .css('left', columnLeft + 15)
                     .on('webkitAnimationEnd', this.die.bind(this))
                     .appendTo(container);

   Fire.count++;
}

Fire.count = 0;

Fire.prototype.isCollision = false;

Fire.prototype = Object.create(Subscribable.prototype);

Fire.prototype.explode = function(top) {
   this.isCollision = true;
   this._sprite.css('top', top).addClass('exploding');
   return this;
};

Fire.prototype.die = function() {
   this._sprite.remove();
   this.fire('died', this);
   Fire.count--;
   return this;
};

Fire.prototype.getTop = function() {
   return this._sprite.position().top;
};

