describe('Register', () => {
  it('registers as passenger and redirects to login page', () => {
    cy.on("uncaught:exception", () => false);
    cy.visit('/auth/register');
    cy.get('input[name="firstName"]').type("Gabriel");
    cy.get('input[name="lastName"]').type("Yordanov");
    cy.get('input[name="birthDate"]').type("2005-04-11");
    cy.get('input[name="email"]').type("gabe@gmail.com");
    cy.get('input[name="password"]').type("test_password");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/auth/login");
  })
})