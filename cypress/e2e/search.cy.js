describe("Search Flights", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", () => false);

    cy.session("passenger-login", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/auth/csrf`,
      });

      cy.visit("/auth/login");

      cy.get('input[name="email"]').type("gabrielYord@mail.com");
      cy.get('input[name="password"]').type("gabito");

      cy.intercept("POST", "**/auth/login").as("login");

      cy.get('button[type="submit"]').click();

      cy.wait("@login")
        .its("response.statusCode")
        .should("be.oneOf", [200, 204]);

      cy.url({ timeout: 10000 }).should("include", "/passenger");
    });

    cy.visit("/flights/search");

    cy.get(".search-box", { timeout: 10000 }).should("be.visible");
  });

  it("shows error when searching without filling fields", () => {
    cy.contains("button", "Search").click();
    cy.contains("Please fill all fields.").should("be.visible");
  });

  it("shows airport suggestions when typing departure", () => {
    cy.get("#departure").type("AMS");
    cy.get(".search-dropdown-item").should("have.length.greaterThan", 0);
  });

  it("shows airport suggestions when typing arrival", () => {
    cy.get("#arrival").type("JFK");
    cy.get(".search-dropdown-item").should("have.length.greaterThan", 0);
  });

  it("clears suggestions after selecting departure airport", () => {
    cy.get("#departure").type("AMS");
    cy.get(".search-dropdown-item").first().click();
    cy.get(".search-dropdown-item").should("not.exist");
  });

  it("selects airports and searches for flights", () => {
    cy.get("#departure").type("AMS");
    cy.get(".search-dropdown-item").first().click();

    cy.get("#arrival").type("JFK");
    cy.get(".search-dropdown-item").should("have.length.greaterThan", 0);
    cy.get(".search-dropdown-item").first().click();

    cy.get("#departure-date").clear().type("2026-08-01");

    cy.intercept("GET", "**/flights/duffel/search**").as("searchFlights");

    cy.contains("button", "Search").click();

    cy.wait("@searchFlights", { timeout: 30000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.get(".flight-results", { timeout: 30000 }).should("be.visible");
  });
});