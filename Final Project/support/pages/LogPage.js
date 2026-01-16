class LogPage {
    elements = {
        userInput: () => cy.get('input[name="username"]'),
        passInput: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('button[type="submit"]'),
        alertContent: () => cy.get('.oxd-alert-content-text'),
        inputError: () => cy.get('.oxd-input-field-error-message'),
        forgotLink: () => cy.contains('p', 'Forgot your password?'),
        // Forgot password page elements
        forgotUserInput: () => cy.get('input[name="username"]').eq(0), // mungkin ada dua, ambil yang pertama
        resetBtn: () => cy.contains('button', 'Reset Password'),
        cancelBtn: () => cy.contains('button', 'Cancel'),
        forgotTitle: () => cy.get('.oxd-text--h6'),
        resetSuccessMsg: () => cy.get('.oxd-text--h6')
    }

    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')

        cy.get('.orangehrm-login-branding').should('be.visible')
    }

    login(username, password) {
        if (username) this.elements.userInput().clear().type(username)
        if (password) this.elements.passInput().clear().type(password)
        this.elements.loginBtn().click()
    }

    clickForgot() {
        this.elements.forgotLink().click()
    }
}

export default new LogPage();
