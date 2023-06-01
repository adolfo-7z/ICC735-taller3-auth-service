import { getCriminalRecords } from '../../src/services/registro-civil.service.js';
import mock from '../../src/services/__mocks__/registro-civil.service.mocks.js';
import axios from 'axios';

jest.mock('axios');

describe("getCriminalRecords", () => {
    it("should return true when criminal records exist", async () => {
      const mockRut = "19812327-7";
      const expectedResponse = {
        rut: mockRut,
        fullName: "Juan Perez",
        quantity: 3,
      };
      
      // Mock the Axios response
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
      
      // Call the function under test
      const result = await getCriminalRecords(mockRut);
      
      // Assertions
      expect(result).toBe(true);
      expect(axios.get).toHaveBeenCalledWith(`/person/${mockRut}/criminal_records`, {
        headers: {
          "X-API-Key": "1234567890",
        },
      });
    });
  
    it("should return false when criminal records don't exist", async () => {
      const mockRut = "19812327-7";
      const expectedResponse = {
        rut: mockRut,
        fullName: "John Doe",
        quantity: 0,
      };
      
      // Mock the Axios response
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
      
      // Call the function under test
      const result = await getCriminalRecords(mockRut);
      
      // Assertions
      expect(result).toBe(false);
      expect(axios.get).toHaveBeenCalledWith(`/person/${mockRut}/criminal_records`, {
        headers: {
          "X-API-Key": "1234567890",
        },
      });
    });
  
    it("should handle errors and return false", async () => {
      const mockRut = "invalid-rut";
      const expectedErrorMessage = "Error fetching criminal records:";
      
      // Mock the Axios response to throw an error
      axios.get.mockRejectedValueOnce(new Error("Network Error"));
      
      // Spy on the console.error method to check if it was called with the expected error message
      jest.spyOn(console, "error").mockImplementationOnce((message) => {
        expect(message).toContain(expectedErrorMessage);
      });
      
      // Call the function under test
      const result = await getCriminalRecords(mockRut);
      
      // Assertions
      expect(result).toBe(false);
      expect(axios.get).toHaveBeenCalledWith(`/person/${mockRut}/criminal_records`, {
        headers: {
          "X-API-Key": "1234567890",
        },
      });
    });
  });
  