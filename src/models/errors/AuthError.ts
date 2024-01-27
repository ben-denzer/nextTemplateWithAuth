export class AuthError extends Error {
  constructor(message?: string) {
    super(message || 'unauthorized');
    this.name = 'Authorization Error';
  }
}
