export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    // Устанавливаем имя прототипа для поддержки instanceof
    // Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
