import chai from "chai";
import originalSinon from "sinon";
import sinonChai from "sinon-chai";

chai.should();
chai.use(sinonChai);

export const { assert, expect } = chai;
export const sinon = originalSinon;