export class InvalidRequestPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRequestPayloadError';
  }
}
