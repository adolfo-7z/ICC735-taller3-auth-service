import bcrypt from 'bcrypt';
import UserModel from '../../src/models/user.model';

describe("User Model", () => {
  let user;

  beforeEach(() => {
    user = new UserModel({
      name: "John Doe",
      email: "john@example.com",
      password: "pass123",
      rut: "ABCD1234",
      verified: false,
      code: "ABC123",
      blocked: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // describe("Pre save user", () => {
  //   it("[SUCCESS] Should hash the password if it has been modified", async () => {
  //     const next = jest.fn();
  //     const mockHash = jest.spyOn(bcrypt, 'hash').mockImplementation((password, salt, callback) => {
  //       callback(null, 'hashedPassword');
  //     });
    
  //     user.password = "newPass123";
  //     await user.save();
    
  //     expect(mockHash).toHaveBeenCalledTimes(1);
  //     expect(mockHash).toHaveBeenCalledWith(
  //       "newPass123",
  //       expect.any(String),
  //       expect.any(Function)
  //     );
  //     expect(user.password).not.toBe("newPass123");
  //     expect(next).toHaveBeenCalledTimes(1);
    
  //     mockHash.mockRestore();
  //   }, 10000);    
  // });

  describe("comparePassword", () => {
    it("[SUCCESS] Should return true if the candidate password matches the hashed password", async () => {
      const candidatePassword = "pass123";
      user.password = await bcrypt.hash(candidatePassword, 10);

      const result = await user.comparePassword(candidatePassword);

      expect(result).toBe(true);
    });

    it("[ERROR] Should return false if the candidate password does not match the hashed password", async () => {
      const candidatePassword = "wrongPassword";
      user.password = await bcrypt.hash("pass123", 10);

      const result = await user.comparePassword(candidatePassword);

      expect(result).toBe(false);
    });
  });

  describe("setVerified", () => {
    it("[SUCCESS] Should set user.verified to true and user.code to null", async () => {
      user.setVerified();

      expect(user.verified).toBe(true);
      expect(user.code).toBeNull();
    });
  });
});
