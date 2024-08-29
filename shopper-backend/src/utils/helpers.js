/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalize(str) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Reverses a string.
 * @param {string} str - The string to reverse.
 * @returns {string} - The reversed string.
 */
function reverseString(str) {
  if (typeof str !== "string") {
    throw new TypeError("Expected a string");
  }
  return str.split("").reverse().join("");
}

/**
 * Transform to camelCase a string.
 * @param {string} str - The string to transform em camalCase.
 * @returns {string} - The camelCased string.
 */
function toCamelCase(str) {
  let camelCaseString = str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  camelCaseString =
    camelCaseString.charAt(0).toLowerCase() + camelCaseString.slice(1);
  return removeSpecialCharacters(camelCaseString);
}
function toScreamingSnakeCase(str) {
  return removeSpecialCharacters(str)
    .toUpperCase() // Convert to upper case
    .replace(/([a-z])([A-Z])/g, "$1_$2") // Insert underscore between camelCase
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w\s]/g, ""); // Remove all non-word characters
}
function removeSpecialCharacters(str) {
  let hexAccentMap = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  };
  let newstring = str;
  for (let i in hexAccentMap) {
    newstring = newstring.replace(hexAccentMap[i], i);
  }
  return newstring.replace(/[^a-zA-Z0-9 ]/g, "").trim();
}
function isNumber(str) {
  return !isNaN(Number(str));
}

function generatePattern(sequencial, month, year) {
  // Validar entradas
  logger.info(!!!sequencial);
  if (!sequencial || isNaN(sequencial)) {
    throw "Sequencial inválido";
  }

  if (!month || month < 1 || month > 12) {
    throw "Mês de criação inválido";
  }

  if (!year || isNaN(year)) {
    throw "Ano de criação inválido";
  }

  // Formatar sequencial
  const sequencialFormated = sequencial.toString().padStart(4, "0");

  // Formatar mês
  const monthFormated = month.toString().padStart(2, "0");

  // Formatar ano
  const yearFormated = year.toString();

  // Gerar padrão final
  const patternString = `${sequencialFormated}-${monthFormated}/${yearFormated}`;

  return patternString;
}

export { capitalize, reverseString, removeSpecialCharacters };
