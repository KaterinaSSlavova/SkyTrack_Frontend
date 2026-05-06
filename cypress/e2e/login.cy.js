describe('Login', () => {
  it('logs in as admin and redirects to airports', () => {
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("kate@gmail.com");
    cy.get('input[name="password"]').type("qwerty");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/airports");
  });

  it('logs in as passenger and redirects to dashboard', () => {
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type("gabrielYord@mail.com");
    cy.get('input[name="password"]').type("gabito");
    cy.get('button[type="submit"]').click();

     cy.url().should("include", "/passenger");
  });
});