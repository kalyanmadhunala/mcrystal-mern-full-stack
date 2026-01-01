import numberToWords from "number-to-words";

export const amountInWords = (amount) => {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = numberToWords.toWords(rupees)
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (paise > 0) {
    words += ` Rupees And ${numberToWords
      .toWords(paise)
      .replace(/\b\w/g, (c) => c.toUpperCase())} Paise`;
  } else {
    words += " Rupees Only";
  }

  return words;
};
