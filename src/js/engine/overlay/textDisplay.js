/**
 * This draws the given text onto the canvas. It allows for the font to be configured and aligns
 * the coordinates with the top-left of the text, instead of the bottom-left.
 */
class TextDisplay {
  /**
   * Creates a text display.
   * @param x {number}
   * @param y {number}
   * @param maxWidth {number}
   */
  constructor(x, y, maxWidth) {
    /**
     * The x-coordinate on the canvas.
     * @type {number}
     */
    this.x = x;
    /**
     * The y-coordinate on the canvas.
     * @type {number}
     */
    this.y = y;
    /**
     * The maximum width of the drawn text.
     * @type {number}
     */
    this.maxWidth = maxWidth;
    /**
     * The size of the drawn text.
     * @type {number}
     */
    this.fontSize = 12;
    /**
     * The font of the drawn text.
     * @type {string}
     */
    this.fontName = 'Verdana';
    /**
     * The color of the drawn text.
     * @type {string}
     */
    this.fontColor = '#000';
    /**
     * The text that is drawn.
     * @type {string}
     */
    this.text = '';
  }

  /**
   * Draws the text onto the canvas. Sets up the font and color.
   * @param context {CanvasRenderingContext2D}
   */
  draw(context) {
    context.font = `${this.fontSize}pt ${this.fontName}`;
    context.fillStyle = this.fontColor;
    let textHeight = parseInt(context.font);
    context.fillText(this.text, this.x, this.y + textHeight);
  }
}
