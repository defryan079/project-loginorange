//QA Tester : Deffrian Prayogo
//date : 15/01/2026

describe('Login Scenario dengan URL Intercept yang berbeda', () => {

    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages').as('pageLoad')
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.wait('@pageLoad')
    })

    // 1. LOGIN SUKSES (Normal)
    it('Test case 1 - Login Normal (Success)', () => {
        cy.get('input[name="username"]').type("Admin")
        cy.get('input[name="password"]').type("admin123")
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary').as('actSum')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@actSum').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
        })
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard')
    })

    // 2. LOGIN GAGAL (User & Pass Salah)
    it('Test case 2 - User & Pass Salah', () => {
        cy.get('input[name="username"]').type("Mimin")
        cy.get('input[name="password"]').type("mimin123")

        cy.intercept('POST', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('loginValidate')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@loginValidate').then((interception) => {

            expect(interception.response.statusCode).to.exist
        })

        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 3. LOGIN KOSONG
    it('Test case 3 - User & Pass Kosong', () => {

        cy.get('.oxd-button').click()

        cy.get('.oxd-input-field-error-message').first().should('contain', 'Required')
    })

    // 4. LOGIN SUKSES (USERNAME CAPSLOCK)
    it('Test case 4 - Username KAPITAL & Pass Benar', () => {
        cy.get('input[name="username"]').type("ADMIN")
        cy.get('input[name="password"]').type("admin123")
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/shortcuts').as('apiShortcuts')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@apiShortcuts').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
        })
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard')
    })

    // 5. LOGIN GAGAL (PASS CAPSLOCK)
    it('Test case 5 - Password KAPITAL & Username Benar', () => {
        cy.get('input[name="username"]').type("Admin")
        cy.get('input[name="password"]').type("ADMIN123")
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login').as('pageReload')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@pageReload')
        
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 6. LOGIN GAGAL (USERNAME BENAR, PASS SALAH)
    it('Test case 6 - Username Benar & Pass Salah', () => {
        cy.get('input[name="username"]').type("Admin")
        cy.get('input[name="password"]').type("sayurkol12")
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages').as('msgErrorLoad')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@msgErrorLoad')
        
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 7. LOGIN GAGAL (USERNAME SALAH, PASS BENAR)
    it('Test case 7 - Username Salah & Pass Benar', () => {
        cy.get('input[name="username"]').type("Mimin")
        cy.get('input[name="password"]').type("admin123")

        cy.intercept('POST', 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate').as('validateCheck')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@validateCheck')

        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

})
