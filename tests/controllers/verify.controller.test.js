import { expect, jest } from "@jest/globals";
import * as VerifyLogic from "../../src/logic/verify.logic.js";
import { HTTPError } from "../../src/helpers/error.helper.js";
import verifyMessages from '../../src/messages/verify.messages.js';
import verify from "../../src/controllers/verify.controller.js";

describe("Controller: Verify", () => {
    const verifyLogicStub = jest.spyOn(VerifyLogic, "default");

    const defaultReq = {
        body: {
            code: "123456",
        },
        userId: "user123",
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    it("[ERROR] Should throw an error when the code doesn't exist in the body", async () => {
        const req = {
            body: {},
            userId: "user123",
        };

        const httpError = new HTTPError({
            name: verifyMessages.validation.name,
            msg: verifyMessages.validation.messages.code,
            code: 400,
        });

        await verify(req, res);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith({ error: { ...httpError } });
        expect(verifyLogicStub).not.toBeCalled();
    });

    it("[ERROR] Should throw an 500 error when verifyLogic throws a TypeError", async () => {
        const error = new TypeError("some-error");

        verifyLogicStub.mockRejectedValue(error);

        await verify(defaultReq, res);

        expect(res.status).toBeCalledWith(500);
        expect(res.json).toBeCalledWith({ error: error.toString() });
        expect(verifyLogicStub).toBeCalled();
    });

    it("[ERROR] Should throw an 400 error when verifyLogic throws an HTTPError with 400 code", async () => {
        const error = new HTTPError({
            name: verifyMessages.validation.name,
            msg: verifyMessages.validation.messages.code,
            code: 400,
        });

        verifyLogicStub.mockRejectedValue(error);

        await verify(defaultReq, res);

        expect(res.status).toBeCalledWith(400);
        expect(res.json).toBeCalledWith({ error: { ...error } });
        expect(verifyLogicStub).toBeCalled();
    });

    it("[SUCCESS] Should return success response when verification is successful", async () => {
        const successResponse = "Verification successful";

        verifyLogicStub.mockResolvedValue(successResponse);

        await verify(defaultReq, res);
        expect(res.json).toBeCalledWith({ response: successResponse });
        expect(res.status).toBeCalledWith(200);
        expect(verifyLogicStub).toBeCalledWith({
            userId: defaultReq.userId,
            code: defaultReq.body.code,
        });
    });
});