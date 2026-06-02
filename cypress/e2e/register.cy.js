describe('Register', () => {
  it('registers as passenger and redirects to login page', () => {
    const uniqueEmail = `gabe+${Date.now()}@gmail.com`;
    cy.on("uncaught:exception", () => false);
    const apiBaseUrl = Cypress.env("apiUrl");

    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/auth/csrf`,
    });

    cy.visit('/auth/register');
    cy.get('input[name="firstName"]').type("Gabriel");
    cy.get('input[name="lastName"]').type("Yordanov");
    cy.get('input[name="birthDate"]').type("2005-04-11");
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type("test_password");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/auth/login");
  })
})