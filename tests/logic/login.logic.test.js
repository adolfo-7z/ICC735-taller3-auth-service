import login from "../../src/logic/login.logic.js";
import UserModel from "../../src/models/user.model.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import loginMessages from "../../src/messages/login.messages.js";
import { generateToken } from "../../src/helpers/jwt.helper.js";

// Mock the necessary dependencies
jest.mock("../../src/models/user.model.js");
jest.mock("../../src/helpers/jwt.helper.js");

describe("login.logic", () => {
  const invalidPasswordUser = {
    _id: "user-id",
    email: "test@example.com",
    password: "password",
    blocked: false,
    comparePassword: jest.fn(),
  };
  const blockedUser = {
    _id: "user-id",
    email: "test@example.com",
    password: "password",
    blocked: true,
    verified: true,
    comparePassword: jest.fn().mockResolvedValue(true),
  };
  const foundUser = {
    _id: "user-id",
    email: "test@example.com",
    password: "password",
    blocked: false,
    verified: true,
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


it("[ERROR] Should throw HTTPError if user is blocked", async () => {
  const blockedError = new HTTPError({
    name: loginMessages.blocked.name,
    msg: loginMessages.blocked.message,
    code: 403,
  });
  UserModel.findOne.mockReturnValue({
    select: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(blockedUser),
    }),
  });

  expect.assertions(1);
  return login({ email: "test@example.com", password: "password" }).catch((error) => {
    expect(error).toEqual(blockedError);
  });

});

it("[ERROR]Should throw HTTPError if user is not found", () => {
    const invalidCredentialsErrorMessage = "Invalid email or password";
    const invalidCredentialsError = new HTTPError({
      name: loginMessages.invalidCredentials.name,
      msg: loginMessages.invalidCredentials.message,
      code: 400,
    });

    UserModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    });
    loginMessages.invalidCredentials.message = invalidCredentialsErrorMessage;

    expect.assertions(2);
    return login({ email: "test@example.com", password: "password" }).catch((error) => {
      expect(error).toEqual(invalidCredentialsError);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: new RegExp(`^test@example.com$`, "i"),
    });
  });
});

  it("[ERROR] Should throw HTTPError if password does not match", () => {
    const invalidCredentialsErrorMessage = "Invalid email or password";
    const invalidCredentialsError = new HTTPError({
      name: loginMessages.invalidCredentials.name,
      msg: loginMessages.invalidCredentials.message,
      code: 400,
    });

    UserModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(invalidPasswordUser),
      }),
    });
    invalidPasswordUser.comparePassword.mockResolvedValue(false);
    loginMessages.invalidCredentials.message = invalidCredentialsErrorMessage;

    expect.assertions(3);
    return login({ email: "test@example.com", password: "password" }).catch((error) => {
      expect(error).toEqual(invalidCredentialsError);
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: new RegExp(`^test@example.com$`, "i"),
      });
      expect(invalidPasswordUser.comparePassword).toHaveBeenCalledWith("password");
    });
  });

  it("[SUCCESS] Should return token and verified status if login is successful", () => {
    const token = "generated-token";
    const verified = true;
    UserModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundUser),
      }),
    });
    foundUser.comparePassword.mockResolvedValue(true);
    generateToken.mockReturnValue(token);

    expect.assertions(4);
    
    return login({ email: "test@example.com", password: "password" }).then((result) => {
      expect(result).toEqual({ token, verified });
      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: new RegExp(`^test@example.com$`, "i"),
      });
      expect(foundUser.comparePassword).toHaveBeenCalledWith("password");
      expect(generateToken).toHaveBeenCalledWith({ data: { id: "user-id" } });
    });
  });
});
