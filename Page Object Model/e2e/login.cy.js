// Import class LoginPage
import loginPage from '../support/pages/LoginPage';

//QA Tester : Deffrian Prayogo
//date : 15/01/2026

describe('Login Scenarios using POM & Intercept', () => {

    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        
        // Panggil fungsi visit dari POM
        loginPage.visit()
        
    })

    it('Test case 1 - Login Normal (Success)', () => {
        // Panggil Action dari POM
        loginPage.inputUsername('Admin')
        loginPage.inputPassword('admin123')
        loginPage.clickLogin()
        loginPage.elements.dashboardTitle().should('contain', 'Dashboard')
    })

    it('Test case 2 - User & Pass Salah', () => {
        loginPage.inputUsername('Mimin')
        loginPage.inputPassword('mimin123')   
        loginPage.clickLogin()               
        loginPage.elements.errorMessage().should('contain', 'Invalid credentials')
    })

    it('Test case 3 - User & Pass Kosong', () => {
        // Langsung klik tanpa isi
        loginPage.clickLogin()

        // Assert Required Message
        loginPage.elements.requiredMessage().should('contain', 'Required')
    })

    it('Test case 4 - User KAPITAL password normal', () => {
        loginPage.inputUsername('ADMIN')
        loginPage.inputPassword('admin123')
        loginPage.clickLogin()
        loginPage.elements.dashboardTitle().should('contain', 'Dashboard') //karena hasilnya berhasil (tidak gagal)
    })

    it('Test case 5 - Pass KAPITAL & Username Benar', () => {
        loginPage.inputUsername('Admin')
        loginPage.inputPassword('ADMIN123')
        loginPage.clickLogin()
        loginPage.elements.errorMessage().should('contain', 'Invalid credentials') //karena hasilnya berhasil (tidak gagal)
    })

    it('Test case 6 - Username Benar & Pass Salah', () => {
        loginPage.inputUsername('Admin')
        loginPage.inputPassword('sayurkol123')
        loginPage.clickLogin()
        loginPage.elements.errorMessage().should('contain', 'Invalid credentials') //karena hasilnya berhasil (tidak gagal)
    })  
    
    it('Test case 7 - Username Salah & Pass Benar', () => {
        loginPage.inputUsername('Mimin')
        loginPage.inputPassword('admin123')
        loginPage.clickLogin()
        loginPage.elements.errorMessage().should('contain', 'Invalid credentials')
    })

})
