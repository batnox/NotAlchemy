class TextDisplay {
  constructor(x, y, maxWidth) {
    this.x = x;
    this.y = y;
    this.maxWidth = maxWidth;
    this.fontSize = 12;
    this.fontName = 'Verdana';
    this.fontColor = '#000';
    this.text = '';
  }

  draw(context) {
    context.font = `${this.fontSize}pt ${this.fontName}`;
    context.fillStyle = this.fontColor;
    let textHeight = parseInt(context.font);
    context.fillText(this.text, this.x, this.y + textHeight);
  }
}
