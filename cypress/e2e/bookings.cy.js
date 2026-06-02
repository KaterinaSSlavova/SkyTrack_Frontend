describe('My Bookings', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.request('GET', 'http://localhost:8080/auth/csrf');
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type("gabrielYord@mail.com");
    cy.get('input[name="password"]').type("gabito");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/passenger");
    cy.visit('/bookings');
    cy.get('.bookings-content', { timeout: 10000 }).should('be.visible');
  });

  it('shows the bookings page title', () => {
    cy.contains('My Bookings').should('be.visible');
  });

  it('shows bookings tabs', () => {
    cy.contains('button', 'Upcoming').should('be.visible');
    cy.contains('button', 'Past').should('be.visible');
    cy.contains('button', 'Cancelled').should('be.visible');
  });

  it('switches to past tab', () => {
    cy.contains('button', 'Past').click();
    cy.contains('button', 'Past').should('have.class', 'active');
  });

  it('switches to cancelled tab', () => {
    cy.contains('button', 'Cancelled').click();
    cy.contains('button', 'Cancelled').should('have.class', 'active');
  });

  it('shows upcoming tab as active by default', () => {
    cy.contains('button', 'Upcoming').should('have.class', 'active');
  });
});