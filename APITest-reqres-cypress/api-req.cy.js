// QA Tester : Deffrian Prayogo
// Date : 15/01/2026

describe('API Request Automation with Cypress', () => {

    const baseUrl = 'https://reqres.in/api';

    const apiToken = 'pub_09d2add4e735791914cce550896f2c42da18434c12533fe4cdc0db1a06258cc1'; //api reqress
    const requestHeaders = {
        'Authorization': apiToken, 
    };

    // KELOMPOK 1: GET REQUEST

    it('1. GET - List Users (Page 2)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users?page=2`,
            headers: requestHeaders // Sisipkan header di sini
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.page).to.eq(2);
            expect(response.body.data).to.have.length(6);
        });
    });

    it('2. GET - Single User (ID 2 - Janet)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users/2`,
            headers: requestHeaders
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.first_name).to.eq('Janet');
        });
    });

    it('3. GET - Single User NOT FOUND (ID 23)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users/23`,
            headers: requestHeaders,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('4. GET - List Resource (Unknown)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/unknown`,
            headers: requestHeaders
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.be.an('array');
        });
    });

    it('5. GET - Single Resource (ID 2 - Fuchsia Rose)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/unknown/2`,
            headers: requestHeaders
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.name).to.eq('fuchsia rose');
        });
    });

    it('6. GET - Single Resource NOT FOUND (ID 23)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/unknown/23`,
            headers: requestHeaders,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('7. GET - Delayed Response (Simulasi Loading 3 detik)', () => {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/users?delay=3`,
            headers: requestHeaders,
            timeout: 5000 
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.length.greaterThan(0);
        });
    });


    // KELOMPOK 2: POST REQUEST

    it('8. POST - Create User (Deffrian)', () => {
        const body = { name: "Deffrian", job: "QA Engineer" };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            headers: requestHeaders,
            body: body
        }).then((response) => {
            expect(response.status).to.eq(201); 
            expect(response.body.name).to.eq("Deffrian");
        });
    });

    it('9. POST - Register Successful', () => {
        const body = { email: "eve.holt@reqres.in", password: "pistol" };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/register`,
            headers: requestHeaders,
            body: body
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
        });
    });

    it('10. POST - Register Unsuccessful (No Password)', () => {
        const body = { email: "sydney@fife" };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/register`,
            headers: requestHeaders,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400); 
            expect(response.body.error).to.eq("Missing password");
        });
    });

    it('11. POST - Login Successful', () => {
        const body = { email: "eve.holt@reqres.in", password: "cityslicka" };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            headers: requestHeaders,
            body: body
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
        });
    });

    it('12. POST - Login Unsuccessful (No Password)', () => {
        const body = { email: "peter@klaven" };
        cy.request({
            method: 'POST',
            url: `${baseUrl}/login`,
            headers: requestHeaders,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body.error).to.eq("Missing password");
        });
    });


    //KELOMPOK 3: PUT & PATCH

    it('13. PUT - Update User Full (Deffrian -> Deffrian Senior)', () => {
        const body = { name: "Deffrian Senior", job: "Manager" };
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/users/2`,
            headers: requestHeaders,
            body: body
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.job).to.eq("Manager");
        });
    });

    it('14. PATCH - Update User Partial (Cuma Ganti Job)', () => {
        const body = { job: "Director" };
        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/users/2`,
            headers: requestHeaders,
            body: body
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.job).to.eq("Director");
        });
    });


    //KELOMPOK 4: DELETE

    it('15. DELETE - Delete User', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/users/2`,
            headers: requestHeaders
        }).then((response) => {
            expect(response.status).to.eq(204); 
        });
    });

});
