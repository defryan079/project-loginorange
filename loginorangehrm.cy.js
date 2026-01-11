//QA Tester : Deffrian Prayogo
//date : 11/01/2026
describe('Visit web', () => {
    beforeEach(() => {
        // Bersihkan cache setelah selesai (opsional)
        cy.clearCookies()
        cy.clearLocalStorage()
        // Buka halaman web utama
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    })
    

    it('Test dengan user dan pass yang benar', () => {
        // Isi form login
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('admin123')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya berhasil
        cy.get('.oxd-topbar-header-title').should('be.visible')
    
    })

    it('Test dengan user dan pass yang salah', () => {
        // Isi form login
        cy.get('input[name="username"]').type('Mimin')
        cy.get('input[name="password"]').type('mimin123')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya gagal
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })

    it('Test dengan user dan pass yang kosong', () => {
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya gagal
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })


    it('Test dengan username kapital dan pass benar', () => {
        // Isi form login
        cy.get('input[name="username"]').type('ADMIN')
        cy.get('input[name="password"]').type('admin123')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya berhasil
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })

    it('Test dengan password kapital dan username benar', () => {
        // Isi form login
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('ADMIN123')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya berhasil
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })

    it('Test dengan username benar dan pass salah', () => {
        // Isi form login
        cy.get('input[name="username"]').type('Admin')
        cy.get('input[name="password"]').type('sayurkol12')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya berhasil
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })

    it('Test dengan username salah dan pass benar', () => {
        // Isi form login
        cy.get('input[name="username"]').type('Mimin')
        cy.get('input[name="password"]').type('admin123')
        
        // Klik tombol login
        cy.get('.oxd-button').click()

        // Login seharusnya berhasil
        cy.get('.oxd-topbar-header-title').should('be.visible')
    })


})
