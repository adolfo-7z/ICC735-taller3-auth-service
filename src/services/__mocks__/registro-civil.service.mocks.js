import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import REGISTRO_CIVIL_API  from "../../config/environment.js";

const mock = new MockAdapter(axios);

const rutRegex = /\/person\/([^/]+)\/criminal_records/; // Regular expression to match the dynamic part (rut)

const storedApiKey = '1234567890'; // Replace with the stored API key

mock.onGet(REGISTRO_CIVIL_API.BASE_URL+rutRegex).reply(config => {
  const rut = config.url.split("/")[2]; // Extract the rut value from the URL
  const apiKey = config.headers['X-API-Key']; // Extract the API key from the headers

  if (apiKey === storedApiKey) {
    if(!validateRut(rut)) {
      const errorMessage = 'Rut invalido o mal formateado';
      return [400, { error: errorMessage }];
    }else{
      const responseData = {
        rut,
        fullName: 'Juan Perez',
        quantity: 0      
      };
      return [200, responseData];
      
    };
  } else {
    const errorMessage = 'API key invalida o sin permisos';
    return [401, { error: errorMessage }];
  }
});

function validateRut(rut) {
  // validate rut is a valid chilean rut
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
    return false;
  }

  const rutSplit = rut.split("-");
  let rutNumber = rutSplit[0];
  let rutDv = rutSplit[1];

  if (rutDv === "K") {
    rutDv = "k";
  }
  
  return dvValidation(rutNumber, rutDv);
}

function dvValidation(rutNumber, rutDv) {
  let M = 0;
  let S = 1;
  
  for (; rutNumber; rutNumber = Math.floor(rutNumber / 10)) {
    S = (S + (rutNumber % 10) * ((9 - M++ % 6) + 1)) % 11;
  }
  
  return S ? S - 1 : "k";
}

export default mock;
