
function SpaceShip() {
   Game.on('interaction.pointermoved', this.alignSpriteToInteraction, this);
   Game.on('colorchanged', this.onNextColorChanged, this);
   this._sprite = jQuery('#spaceship-icon').addClass(Game.nextColor);
}

SpaceShip.prototype.left = 0;

SpaceShip.prototype.alignSpriteToInteraction = function(left) {
   if(left != this.left) {
      this._sprite.css('background-position', ((this.left = left) - 24) + 'px 0');
   }
};

SpaceShip.prototype.onNextColorChanged = function(newColor, oldColor) {
   var classList = this._sprite[0].classList;
   classList.remove(oldColor);
   classList.add(newColor);
};
