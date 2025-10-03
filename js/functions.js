function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}
checkStringLength('проверяемая строка', 25);

function isPalindrome(string) {
  const normalizedString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }
  return normalizedString === reversedString;
}
isPalindrome('Довод');

function extractNumber(input) {
  const string = input.toString();
  let result = '';
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (!isNaN(parseInt(char, 10))) {
      result += char;
    }
  }
  if (result === '') {
    return NaN;
  }
  return parseInt(result, 10);
}
extractNumber('2025 год');
