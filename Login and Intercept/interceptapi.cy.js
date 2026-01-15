//QA Tester : Deffrian Prayogo
//date : 15/01/2026

describe('Login Scenarios with Full URL Intercept', () => {

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
        
        // Intercept API Action Summary
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
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/themes/default/images/login/ohrm_branding.png').as('brandingImg')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@brandingImg').then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 304]) // 304 artinya ambil dari cache
        })

        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 3. LOGIN KOSONG
    it('Test case 3 - User & Pass Kosong', () => {
        //Kalau ad wait() malah error response, jadi saya hilangin
        cy.get('.oxd-button').click()

        cy.get('.oxd-input-group > .oxd-text--error').first().should('contain', 'Required')
    })

    // 4. LOGIN HARUSNYA GAGAL KARENA USERNAME CAPSLOCK, TAPI HASILNYA BERHASIL
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
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/themes/default/images/login/ohrm_logo.png').as('logoImg')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@logoImg')
        
        // Assert Error
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 6. LOGIN GAGAL (USERNAME BENAR, PASS SALAH)
    it('Test case 6 - Username Benar & Pass Salah', () => {
        cy.get('input[name="username"]').type("Admin")
        cy.get('input[name="password"]').type("sayurkol12")
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/dist/css/fonts/nunito-sans-v6-latin-ext_latin-700.woff2').as('fontFile')
        
        cy.get('.oxd-button').click()
        
        // Assert Error
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

    // 7. LOGIN GAGAL (USERNAME SALAH, PASS BENAR)
    it('Test case 7 - Username Salah & Pass Benar', () => {
        cy.get('input[name="username"]').type("Mimin")
        cy.get('input[name="password"]').type("admin123")
        
        cy.intercept('GET', 'https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages').as('msgReload')
        
        cy.get('.oxd-button').click()
        
        cy.wait('@msgReload')

        // Assert Error
        cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
    })

})
