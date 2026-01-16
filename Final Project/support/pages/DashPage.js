class DashPage {
    elements = {
        topbarTitle: () => cy.get('.oxd-topbar-header-breadcrumb > .oxd-text'),
        userDropdown: () => cy.get('.oxd-userdropdown-tab'),
        logoutLink: () => cy.contains('a[role="menuitem"]', 'Logout'),
        aboutLink: () => cy.contains('a[role="menuitem"]', 'About'),
        menuItem: (name) => cy.contains('.oxd-main-menu-item', name),
        mainContent: () => cy.get('.oxd-layout-context')
    }

    verifyTitle(text) {
        this.elements.topbarTitle().should('contain', text)
    }

    clickMenu(menuName) {
        this.elements.menuItem(menuName).click({ force: true })
    }

    logout() {
        this.elements.userDropdown().click({ force: true })
        // Tunggu dropdown muncul
        this.elements.logoutLink().should('be.visible')
        this.elements.logoutLink().click({ force: true })
    }
}

export default new DashPage();
