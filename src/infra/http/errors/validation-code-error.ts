export default class ValidationCodeNotExistsError extends Error {
  constructor() {
    super("Incorrect data for validation")
    this.name = "ValidationCodeNotExistsError"
  }
}
