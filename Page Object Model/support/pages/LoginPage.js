class LoginPage {
    // Locator
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('.oxd-button'),
        dashboardTitle: () => cy.get('.oxd-topbar-header-title'),
        errorMessage: () => cy.get('.oxd-alert-content-text'),
        requiredMessage: () => cy.get('.oxd-input-group > .oxd-text--error').first()
    }

    // Daftar perintah
    
    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    inputUsername(username) {
        this.elements.usernameInput().type(username);
    }

    inputPassword(password) {
        this.elements.passwordInput().type(password);
    }

    clickLogin() {
        this.elements.loginBtn().click();
    }
}

// Export agar bisa dipanggil
export default new LoginPage();
