export interface ResponseMessage {
    message: string;
}

export class ErrorWithStatus {
    message: string;
    status: number;
    

    constructor({ message, status }: { message: string; status: number }) {
        this.message = message;
        this.status = status;
    }
}
export class EntityError extends ErrorWithStatus {
  errors: Record<string, string>;
  constructor({ message = 'Validation Error', errors }: { message?: string; errors: Record<string, string> }) {
    super({ message, status: 422 }); 
    this.errors = errors;
  }
}