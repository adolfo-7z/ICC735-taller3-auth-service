import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../../src/helpers/jwt.helper';
import environment from '../../src/config/environment';

jest.mock('../../src/config/environment', () => ({
    JWT: {
        SECRET: 'your-secret-key',
        DEFAULT_EXPIRES: '1h',
    },
}));

describe('JWT Helper', () => {
    describe('generateToken', () => {
        it('[SUCCESS] Should generate a JWT token', () => {
            const data = { id: 1, username: 'john.doe' };
            const expiresIn = '2h';
            const mockSign = jest.spyOn(jwt, 'sign');
            const token = generateToken({ data, expiresIn });

            expect(mockSign).toHaveBeenCalledWith(data, 'your-secret-key', { expiresIn });
            expect(token).toBeDefined();
        });

        it('[SUCCESS] Should generate a JWT token with default expiration when expiresIn is not provided', () => {
            const data = { id: 1, username: 'john.doe' };
            const mockSign = jest.spyOn(jwt, 'sign');
            const token = generateToken({ data });

            expect(mockSign).toHaveBeenCalledWith(data, 'your-secret-key', { expiresIn: '1h' });
            expect(token).toBeDefined();
        });
    });

    describe('verifyToken', () => {
        it('[SUCCESS] Should verify and decode a valid JWT token', () => {
            const token = jwt.sign({ id: 1, username: 'john.doe' }, 'your-secret-key');
            const mockVerify = jest.spyOn(jwt, 'verify');
            const decoded = verifyToken(token);

            expect(mockVerify).toHaveBeenCalledWith(token, 'your-secret-key');
            expect(decoded).toEqual(expect.objectContaining({ id: 1, username: 'john.doe' }));
        });

        it('[ERROR] Should throw an error for an invalid JWT token', () => {
            const invalidToken = 'invalid-token';
            const mockVerify = jest.spyOn(jwt, 'verify');

            expect(() => {
                verifyToken(invalidToken);
            }).toThrow(jwt.JsonWebTokenError);

            expect(mockVerify).toHaveBeenCalledWith(invalidToken, 'your-secret-key');
        });
    });
});
