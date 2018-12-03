function generateNumber(places) {
    return Math.ceil(Math.random() * (Math.pow(10, places)));
  }

function generateId() {
    return `${generateNumber(5)}-${generateNumber(6)}-${generateNumber(5)}`;
}

module.exports = generateId;