import { JsonWebTokenError } from 'jsonwebtoken';
import { HTTPError, returnErrorResponse, isBusinessError } from '../../src/helpers/error.helper';

describe('returnErrorResponse', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('[ERROR] Should return the HTTPError response if the error is an instance of HTTPError', () => {
    const error = new HTTPError({ name: 'CustomError', msg: 'Custom error message', code: 400 });

    returnErrorResponse(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { ...error } });
  });

  it('[ERROR] Should return the JWTError response if the error is an instance of JsonWebTokenError', () => {
    const jwtError = new JsonWebTokenError('Invalid token');

    returnErrorResponse(jwtError, mockResponse);

    const expectedError = new HTTPError({ name: jwtError.name, msg: jwtError.message, code: 403 });

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: { ...expectedError } });
  });

  it('[ERROR] Should return the default error response for other types of errors', () => {
    const error = new Error('Some error');

    returnErrorResponse(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: error.toString() });
  });
});

describe('isBusinessError', () => {
  it('[ERROR] Should return true for a business error (4xx)', () => {
    const error = new HTTPError({ name: 'CustomError', msg: 'Custom error message', code: 400 });

    const result = isBusinessError(error);

    expect(result).toBe(true);
  });

  it('[ERROR] Should return false for a non-business error (5xx)', () => {
    const error = new HTTPError({ name: 'CustomError', msg: 'Custom error message', code: 500 });

    const result = isBusinessError(error);

    expect(result).toBe(false);
  });

  it('[ERROR] Should return undefined for an error without a statusCode property', () => {
    const error = new HTTPError({ name: 'CustomError', msg: 'Custom error message' });

    const result = isBusinessError(error);

    expect(result).toBe(undefined);
  });
});

