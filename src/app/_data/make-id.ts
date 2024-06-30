/**
 * Random hexadecimal string generator
 * @param length
 */
export function makeShortId(length = 7) {
  const characters = "zqxjkvbpgyw1245679";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
