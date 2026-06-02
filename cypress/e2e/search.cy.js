describe('Search Flights', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.request('GET', 'http://localhost:8080/auth/csrf');
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type("gabrielYord@mail.com");
    cy.get('input[name="password"]').type("gabito");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/passenger");
    cy.visit('/flights/search');
    cy.get('.search-box', { timeout: 10000 }).should('be.visible');
  });

  it('shows error when searching without filling fields', () => {
    cy.contains('button', 'Search').click();
    cy.contains('Please fill all fields.').should('be.visible');
  });

  it('shows airport suggestions when typing departure', () => {
    cy.get('#departure').type('AMS');
    cy.get('.search-dropdown-item').should('have.length.greaterThan', 0);
  });

  it('shows airport suggestions when typing arrival', () => {
    cy.get('#arrival').type('JFK');
    cy.get('.search-dropdown-item').should('have.length.greaterThan', 0);
  });

  it('clears suggestions after selecting departure airport', () => {
    cy.get('#departure').type('AMS');
    cy.get('.search-dropdown-item').first().click();
    cy.get('.search-dropdown-item').should('not.exist');
  });

  it('selects airports and searches for flights', () => {
    cy.get('#departure').type('AMS');
    cy.get('.search-dropdown-item').first().click();

    cy.get('#arrival').type('JFK');
    cy.get('.search-dropdown-item').should('have.length.greaterThan', 0);
    cy.get('.search-dropdown-item').first().click();
    cy.get('.search-dropdown').should('not.exist');

    cy.get('#departure-date').invoke('removeAttr', 'onClick').type('2026-08-01');

    cy.contains('button', 'Search').click();

    cy.get('.search-loading').should('not.exist');
    cy.get('.flight-results').should('be.visible');
  });
});