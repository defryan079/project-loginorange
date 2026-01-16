import LogPage from '../support/pages/LogPage';
import DashPage from '../support/pages/DashPage';

// QA: Deffrian Prayogo
// Date : 16/Jan/2026

describe('OrangeHRM Automation Web Testing - 35 TC', () => {

    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.intercept('GET', '**/core/i18n/messages').as('pageLoad')
        LogPage.visit()
        cy.wait('@pageLoad', { timeout: 10000 })
        LogPage.elements.userInput().should('be.visible')
    })

    // GROUP 1: LOGIN SCENARIO (TC 01 - 13)

    it('TC-01 Login Valid Data (Admin/admin123)', () => {
        cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary**').as('actSum')
        LogPage.login('Admin', 'admin123')
        cy.wait('@actSum', { timeout: 10000 })
        DashPage.verifyTitle('Dashboard')
    })

    it('TC-02 Login Wrong Password', () => {
        cy.intercept('POST', '**/auth/validate**').as('validate')
        LogPage.login('Admin', 'wrongpass')
        cy.wait('@validate', { timeout: 10000 })
        LogPage.elements.alertContent().should('be.visible')
            .and('contain', 'Invalid credentials')
    })

    it('TC-03 Login Wrong Username', () => {
        cy.intercept('POST', '**/auth/validate**').as('validate')
        LogPage.login('WrongUser', 'admin123')
        cy.wait('@validate', { timeout: 10000 })
        LogPage.elements.alertContent().should('be.visible')
            .and('contain', 'Invalid credentials')
    })

    it('TC-04 Login Empty Username', () => {
        LogPage.elements.passInput().type('admin123')
        LogPage.elements.loginBtn().click()
        cy.get('.oxd-input-group > .oxd-text').first()
            .should('contain', 'Required')
    })

    it('TC-05 Login Empty Password', () => {
        LogPage.elements.userInput().type('Admin')
        LogPage.elements.loginBtn().click()
        cy.get('.oxd-input-group > .oxd-text').first()
            .should('contain', 'Required')
    })

    it('TC-06 Login Empty Both Fields', () => {
        LogPage.elements.loginBtn().click()
        cy.get('.oxd-input-group > .oxd-text').should('have.length', 2)
    })

    it('TC-07 Login Case Sensitive Username (Caps Success)', () => {
        cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary**').as('actSum')
        LogPage.login('ADMIN', 'admin123')
        cy.wait('@actSum', { timeout: 10000 })
        DashPage.verifyTitle('Dashboard')
    })

    it('TC-08 Login Case Sensitive Password (Caps Fail)', () => {
        cy.intercept('POST', '**/auth/validate**').as('validate')
        LogPage.login('Admin', 'ADMIN123')
        cy.wait('@validate', { timeout: 10000 })
        LogPage.elements.alertContent().should('be.visible')
            .and('contain', 'Invalid credentials')
    })

    it('TC-09 Login Swapped Credentials', () => {
        cy.intercept('POST', '**/auth/validate**').as('validate')
        LogPage.login('admin123', 'Admin')
        cy.wait('@validate', { timeout: 10000 })
        LogPage.elements.alertContent().should('be.visible')
            .and('contain', 'Invalid credentials')
    })

    it('TC-10 SQL Injection Attempt', () => {
        cy.intercept('POST', '**/auth/validate**').as('validate')
        LogPage.login("' OR 1=1 --", 'admin123')
        cy.wait('@validate', { timeout: 10000 })
        LogPage.elements.alertContent().should('be.visible')
            .and('contain', 'Invalid credentials')
    })

    it('TC-11 Forgot Password Link Access', () => {
        cy.intercept('GET', '**/auth/requestPasswordResetCode**').as('forgotPage')
        LogPage.clickForgot()
        cy.wait('@forgotPage', { timeout: 10000 })
        LogPage.elements.forgotTitle().should('be.visible')
            .and('contain', 'Reset Password')
    })

    it('TC-12 Forgot Password Cancel', () => {
        LogPage.clickForgot()
        cy.intercept('GET', '**/auth/login**').as('loginPageBack')
        LogPage.elements.cancelBtn().click()
        cy.wait('@loginPageBack', { timeout: 10000 })
        LogPage.elements.userInput().should('be.visible')
    })

    it('TC-13 Forgot Password Send Reset', { pageLoadTimeout: 120000 }, () => {
        LogPage.clickForgot()

        cy.contains('h6', 'Reset Password').should('be.visible')
        LogPage.elements.forgotUserInput().type('Admin')
        cy.intercept('POST', '**/requestResetPassword').as('sendReset')
        
        LogPage.elements.resetBtn().click()
        cy.wait('@sendReset', { timeout: 20000 }) 
        cy.get('.orangehrm-card-container').should('contain', 'Reset Password link sent successfully')
    })

    // GROUP 2: DASHBOARD & NAVIGATION SCENARIOS (TC 14 - 35)
    
    describe('Dashboard Features', () => {
        beforeEach(() => {
            cy.intercept('GET', '**/api/v2/dashboard/employees/action-summary**').as('actSum')
            LogPage.login('Admin', 'admin123')
            cy.wait('@actSum', { timeout: 15000 })
            cy.get('.oxd-topbar-header-title', { timeout: 10000 })
                .should('contain', 'Dashboard')
        })

        it('TC-14 Dashboard Load & Widgets', () => {
            cy.get('.orangehrm-dashboard-widget', { timeout: 10000 })
                .should('have.length.at.least', 3)
        })

        it('TC-15 Menu Admin Access', () => {
            cy.intercept('GET', '**/admin/viewSystemUsers**').as('adminPage')
            DashPage.clickMenu('Admin')
            cy.wait('@adminPage', { timeout: 10000 })
            DashPage.verifyTitle('Admin')
        })

        it('TC-16 Menu PIM Access', () => {
            cy.intercept('GET', '**/pim/viewEmployeeList**').as('pimPage')
            DashPage.clickMenu('PIM')
            cy.wait('@pimPage', { timeout: 10000 })
            DashPage.verifyTitle('PIM')
        })

        it('TC-17 Menu Leave Access', () => {
            cy.intercept('GET', '**/leave/viewLeaveList**').as('leavePage')
            DashPage.clickMenu('Leave')
            cy.wait('@leavePage', { timeout: 10000 })
            DashPage.verifyTitle('Leave')
        })

        it('TC-18 Menu Time Access', () => {
            cy.intercept('GET', '**/time/viewEmployeeTimesheet**').as('timePage')
            DashPage.clickMenu('Time')
            cy.wait('@timePage', { timeout: 10000 })
            DashPage.verifyTitle('Time')
        })

        it('TC-19 Menu Recruitment Access', () => {
            cy.intercept('GET', '**/recruitment/viewCandidates**').as('recruitPage')
            DashPage.clickMenu('Recruitment')
            cy.wait('@recruitPage', { timeout: 10000 })
            DashPage.verifyTitle('Recruitment')
        })

        it('TC-20 Menu My Info Access', () => {
            cy.intercept('GET', '**/pim/viewPersonalDetails/empNumber/**').as('myInfo')
            DashPage.clickMenu('My Info')
            cy.wait('@myInfo', { timeout: 10000 })
            cy.get('.orangehrm-main-title').should('contain', 'Personal Details')
        })

        it('TC-21 Menu Performance Access', () => {
            cy.intercept('GET', '**/performance/searchEvaluatePerformanceReview**').as('perfPage')
            DashPage.clickMenu('Performance')
            cy.wait('@perfPage', { timeout: 10000 })
            DashPage.verifyTitle('Performance')
        })

        it('TC-22 Menu Dashboard Access (Back)', () => {
            DashPage.clickMenu('Admin')
            cy.wait(1000) // Tunggu sebentar
            DashPage.clickMenu('Dashboard')
            DashPage.verifyTitle('Dashboard')
        })

        it('TC-23 Menu Directory Access', () => {
            cy.intercept('GET', '**/directory/viewDirectory**').as('dirPage')
            DashPage.clickMenu('Directory')
            cy.wait('@dirPage', { timeout: 10000 })
            DashPage.verifyTitle('Directory')
        })

        it('TC-24 Menu Maintenance Access', () => {
            DashPage.clickMenu('Maintenance')
            cy.get('input[name="password"]', { timeout: 10000 }).should('be.visible')
            cy.contains('button', 'Cancel').click()
            DashPage.verifyTitle('Dashboard')
        })

        it('TC-25 Menu Claim Access', () => {
            cy.intercept('GET', '**/claim/viewAssignClaim**').as('claimPage')
            DashPage.clickMenu('Claim')
            cy.wait('@claimPage', { timeout: 10000 })
            DashPage.verifyTitle('Claim')
        })

        it('TC-26 Menu Buzz Access', () => {
            cy.intercept('GET', '**/buzz/viewBuzz**').as('buzzPage')
            DashPage.clickMenu('Buzz')
            cy.wait('@buzzPage', { timeout: 10000 })
            DashPage.verifyTitle('Buzz')
        })

        it('TC-27 Search Admin User', () => {
            DashPage.clickMenu('Admin')
            cy.wait(2000) // Tunggu tabel load
            cy.contains('button', 'Search').click()
            cy.get('.oxd-table-card', { timeout: 10000 }).should('have.length.at.least', 1)
        })

        it('TC-28 Add Employee Page', () => {
            DashPage.clickMenu('PIM')
            cy.wait(2000)
            cy.contains('button', 'Add').click()
            cy.get('.orangehrm-main-title', { timeout: 10000 })
                .should('contain', 'Add Employee')
        })

        it('TC-29 Apply Leave Page', () => {
            DashPage.clickMenu('Leave')
            cy.wait(2000)
            cy.contains('li', 'Apply').click()
            cy.get('.orangehrm-main-title', { timeout: 10000 })
                .should('contain', 'Apply Leave')
        })

        it('TC-30 View Timesheets', () => {
            DashPage.clickMenu('Time')
            // Tunggu halaman load dan cari teks 'Select Employee' di halaman
            cy.contains('h6', 'Select Employee', { timeout: 10000 }).should('be.visible')
        })

        it('TC-31 View Candidates', () => {
            DashPage.clickMenu('Recruitment')
            cy.wait(2000)
            cy.get('.orangehrm-paper-container', { timeout: 10000 })
                .should('contain', 'Candidate')
        })

        it('TC-32 My Info Check Elements', () => {
            DashPage.clickMenu('My Info')
            cy.wait(2000)
            cy.get('input[name="firstName"]', { timeout: 10000 })
                .should('be.visible')
        })

        it('TC-33 User Dropdown Toggle', () => {
            DashPage.elements.userDropdown().click({ force: true })
            DashPage.elements.logoutLink().should('be.visible')
        })

        it('TC-34 About Modal', () => {
            DashPage.elements.userDropdown().click()
            DashPage.elements.aboutLink().click()
            cy.get('.orangehrm-modal-header', { timeout: 10000 })
                .should('contain', 'About')
            cy.get('.oxd-dialog-close-button').click({ force: true })
        })

        it('TC-35 Logout Function', () => {
            cy.intercept('GET', '**/core/i18n/messages**').as('logoutLoad')
            DashPage.logout()
            cy.wait('@logoutLoad', { timeout: 10000 })
            LogPage.elements.userInput().should('be.visible')
        })
    })
})
