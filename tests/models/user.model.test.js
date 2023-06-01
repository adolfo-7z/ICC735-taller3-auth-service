import UserModel from '../../src/models/user.model';
import { expect, jest } from "@jest/globals";
import mongoose from "mongoose";
import environment from "../../src/config/environment";
import { connectDB } from '../../src/config/mongo';

const { MONGO_URI } = environment;
let userData;

describe("Models: User model unit test", () => {
	beforeAll(async () => {
		await connectDB(MONGO_URI);
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		await UserModel.deleteMany({});

    userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      rut: "77777776",
      verified: false,
      blocked: false,
      code: "abc123",
    };
	});

  afterEach(() => {
    jest.restoreAllMocks();
  });

	it("[SUCCESS] Create user and hash password", async () => {
		const user = new UserModel(userData);
		await user.save();

		expect(user.password).not.toBe(userData.password);
	});

	it("[SUCCESS] Compare password", async () => {
		const password = "password123";

		const user = new UserModel(userData);
		await user.save();

		const isPasswordMatched = await user.comparePassword(password);
		expect(isPasswordMatched).toBe(true);
	});

	it("[SUCCESS] Set user as verified", async () => {
    const user = new UserModel(userData);
    await user.save();
  
    await user.setVerified();
    const updatedUser = await UserModel.findById(user._id);
  
    expect(updatedUser.verified).toBe(true);
    expect(updatedUser.code).toBeUndefined();
  });  
});
