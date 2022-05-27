const { Parser } = require("expr-eval");
const { parseToRgba } = require("color2k");
const StyleDictionary = require("style-dictionary")
  .extend(`${__dirname}/style-dictionary.config.json`);

const fontWeightMap = {
  thin: 100,
  extralight: 200,
  ultralight: 200,
  extraleicht: 200,
  light: 300,
  leicht: 300,
  normal: 400,
  regular: 400,
  buch: 400,
  medium: 500,
  kraeftig: 500,
  kräftig: 500,
  semibold: 600,
  demibold: 600,
  halbfett: 600,
  bold: 700,
  dreiviertelfett: 700,
  extrabold: 800,
  ultabold: 800,
  fett: 800,
  black: 900,
  heavy: 900,
  super: 900,
  extrafett: 900,
};

/**
 * Helper: Transforms math like Figma Tokens
 */
const parser = new Parser();

function checkAndEvaluateMath(expr) {
  try {
    parser.evaluate(expr);
    return +parser.evaluate(expr).toFixed(3);
  } catch (ex) {
    return expr;
  }
}

/**
 * Helper: Transforms dimensions to px
 */
function transformDimension(value) {
  if (value.endsWith("px")) {
    return value;
  }
  return value + (value ? "px" : "");
}

/**
 * Helper: Transforms letter spacing % to em
 */
function transformLetterSpacing(value) {
  if (value.endsWith("%")) {
    const percentValue = +value.slice(0, -1);
    return `${percentValue / 100}em`;
  }
  return value;
}

/**
 * Helper: Transforms alias to number
 */
function transformFontWeight(value) {
  return fontWeightMap[value.toLowerCase()] || value;
}

/**
 * Helper: Transforms hex rgba colors used in figma tokens: rgba(#ffffff, 0.5) =? rgba(255, 255, 255, 0.5). This is kind of like an alpha() function.
 */
function transformHEXRGBa(value) {
  if (value.startsWith("rgba(#")) {
    const [hex, alpha] = value
      .replace(")", "")
      .split("rgba(")
      .pop()
      .split(", ");
    const [r, g, b] = parseToRgba(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return value;
  }
}

/**
 * Helper: Transforms boxShadow object to shadow shorthand
 * This currently works fine if every value uses an alias, but if any one of these use a raw value, it will not be transformed.
 */
function transformShadow(shadow) {
  const {x, y, blur, spread, color} = shadow;
  return `${x} ${y} ${blur} ${spread} ${color}`;

}

/**
 * Transform typography shorthands for css variables
 */
StyleDictionary.registerTransform({
  name: "typography/shorthand",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "typography",
  transformer: (token) => {
    const {fontWeight, fontSize, lineHeight, fontFamily} =
      token.original.value;
    return `${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
  },
});

/**
 * Transform shadow shorthands for css variables
 */
StyleDictionary.registerTransform({
  name: "shadow/shorthand",
  type: "value",
  transitive: true,
  matcher: (token) => ["boxShadow"].includes(token.type),
  transformer: (token) => {
    return Array.isArray(token.original.value)
      ? token.original.value.map(
          (single) => transformShadow(single)
        ).join(", ")
      : transformShadow(token.original.value);
  },
});

/**
 * Transform sizes to px
 */
StyleDictionary.registerTransform({
  name: "size/px",
  type: "value",
  transitive: true,
  matcher: (token) => [
    "fontSizes",
    "fontSize",
    "lineHeights",
    "lineHeight",
    "dimension",
    "borderRadius",
    "borderWidth",
    "spacing"
  ].includes(token.type),
  transformer: (token) => transformDimension(token.value),
});

/**
 * Transform letterSpacing to em
 */
 StyleDictionary.registerTransform({
  name: "size/letterspacing",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "letterSpacing",
  transformer: (token) => transformLetterSpacing(token.value),
});

/**
 * Transform fontWeights to numerical
 */
StyleDictionary.registerTransform({
  name: "type/fontWeight",
  type: "value",
  transitive: true,
  matcher: (token) => ["fontWeight"].includes(token.type),
  transformer: (token) => transformFontWeight(token.value),
});

/**
 * Transform rgba colors to usable rgba
 */
StyleDictionary.registerTransform({
  name: "color/hexrgba",
  type: "value",
  transitive: true,
  matcher: (token) =>
    typeof token.value === "string" && token.value.startsWith("rgba(#"),
  transformer: (token) => transformHEXRGBa(token.value),
});

/**
 * Transform colors to lowercase
 */
 StyleDictionary.registerTransform({
  name: "color/lowercase",
  type: "value",
  transitive: true,
  matcher: (token) => ["color"].includes(token.type),
  transformer: (token) => token.value.toLowerCase(),
});

/**
 * Transform fontFamily quotes
 */
 StyleDictionary.registerTransform({
  name: "font/quotes",
  type: "value",
  transitive: true,
  matcher: (token) => [
    "fontFamilies",
    "fontFamily",
  ].includes(token.type),
  transformer: (token) => token.value.indexOf(" ") !== -1
    ? `"${token.value}"`
    : token.value,
});

/**
 * Transform to resolve math across all tokens
 */
StyleDictionary.registerTransform({
  name: "resolveMath",
  type: "value",
  transitive: true,
  matcher: (token) => token,
  // Putting this in strings seems to be required
  transformer: (token) => `${checkAndEvaluateMath(token.value)}`
});

StyleDictionary.buildAllPlatforms();
