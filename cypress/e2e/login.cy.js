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

    it('shows error on invalid credentials', () => {
      cy.visit("/auth/login");
      cy.get('input[name="email"]').type("wrong@gmail.com");
      cy.get('input[name="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/auth/login");
    });

    it('blocks login after 5 failed attempts', () => {
      cy.visit("/auth/login");
      for (let i = 0; i < 5; i++) {
        cy.get('input[name="email"]').clear().type("wrong@gmail.com");
        cy.get('input[name="password"]').clear().type("wrongpassword");
        cy.get('button[type="submit"]').click();
        cy.wait(500);
      }
      cy.get('input[name="email"]').clear().type("kate@gmail.com");
      cy.get('input[name="password"]').clear().type("qwerty");
      cy.get('button[type="submit"]').click();
      cy.url().should("include", "/auth/login");
    });
});