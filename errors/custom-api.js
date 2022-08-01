class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    console.log(this.error);
  }
}

module.exports = CustomAPIError;
