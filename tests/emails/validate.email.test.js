import email from '../../src/emails/validate.email';

describe('Email Validation', () => {
  it('[SUCCESS] Should generate the correct email template', () => {
    const name = 'John Doe';
    const code = 'ABC123';

    const expectedEmail = `<h1> Hola ${name}! </h1>` +
    "<p> Necesitas validar este email para unirte a la plataforma </p>" +
    `<p> Usa este c+odigo en la aplicación: ${code} </p>` +
    `<p> <strong>¡Respeta las mayúsculas y minúsculas!</strong> </p>` +
    `<br><p> Un saludo :) </p>`;

    const generatedEmail = email({ name, code });

    expect(generatedEmail).toBe(expectedEmail);
  });
});
