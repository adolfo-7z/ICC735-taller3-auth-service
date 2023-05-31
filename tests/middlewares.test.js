import { authMiddleware } from '../src/middlewares.js';
import { returnErrorResponse } from '../src/helpers/error.helper.js';
import { verifyToken } from '../src/helpers/jwt.helper.js';

jest.mock("../src/helpers/error.helper.js");
jest.mock("../src/helpers/jwt.helper.js");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("[ERROR] Should return 401 if authorization token is missing", () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "need an authorization token!" });
    expect(next).not.toHaveBeenCalled();
    expect(returnErrorResponse).not.toHaveBeenCalled();
  });

  it("[SUCCESS] Should set userId in req and call next if token is valid", () => {
    const token = "valid-token";
    const payload = { id: "user-id" };
    req.headers = {
      Authorization: `Bearer ${token}`,
    };
    verifyToken.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(req.userId).toBe(payload.id);
    expect(next).toHaveBeenCalled();
    expect(returnErrorResponse).not.toHaveBeenCalled();
  });

  it("[ERROR] Should call returnErrorResponse if token verification fails", () => {
    const error = new Error("Token verification failed");
    const token = "invalid-token";
    req.headers = {
      Authorization: `Bearer ${token}`,
    };
    verifyToken.mockImplementation(() => {
      throw error;
    });

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith(token);
    expect(returnErrorResponse).toHaveBeenCalledWith(error, res);
    expect(next).not.toHaveBeenCalled();
  });
});