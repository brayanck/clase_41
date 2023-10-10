const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Testing de ecomerce", function () {
    this.timeout(10000);
    let cartId;
    let userId;
    let productId;
    let cookie;
    before(function () {
        // Configura datos compartidos antes de las pruebas
        this.mockUser = {
            first_name: 'luis',
            last_name: 'gonzales',
            email: 'gonzales@gmail.com',
            age: 16,
            password: '12345',
            role: 'admin',
        };
        this.productId;
    });

    // /api/products
    describe("Test de productos", async function () {
        it("Crear un producto: El API POST /api/products debe crear un producto", async function () {
            // Given
            const productMock = {
                name: "tv",
                description: "la mejor",
                price: 1000000,
                category: "electrodomestico",
                image: "imagen.jpg",
                stock: 20
            };

            // When
            const response = await requester.post("/api/products").send(productMock);
            productId=response._body._id
            
            // Then
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.have.property("_id");
            expect(response.body).to.have.property("stock").that.is.not.equal(0);
        });

        it("Obtener todos los productos: El API GET debe devolver una respuesta válida", async function () {
            // When
            const response = await requester.get("/api/products");
            // Then
            expect(response.statusCode).to.be.equal(200);
            expect(response._body.docs).to.be.an('array').that.is.not.empty;
        });

        it("Obtener un producto: El API GET por ID debe devolver un producto", async function () {
            // Given

            // When
            const response = await requester.get(`/api/products/${productId}`);

            // Then
            expect(response.statusCode).to.be.equal(200);
            expect(response._body).to.have.property("_id").that.is.equal(productId);
        });
    });

    describe("Test de autenticación", async function () {
        it("Registro de usuario: Debe poder crear un usuario", async function () {

            // When
            const response = await requester.post("/api/auth/register/crear").send(this.mockUser);

            cartId=response._body.cartId
            userId = response._body._id

            // Then
            expect(response.statusCode).to.be.equal(200);
        });

        it("Login de usuario: Debe poder hacer login del usuario registrado", async function () {
            // Given
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            };

            // When
            const response = await requester.post("/api/auth/login/crear").send(mockLogin);
            const cookieResult = response.headers['set-cookie'][0];

            // Then
            expect(response.statusCode).to.be.equal(200);
            const cookieData = cookieResult.split("=");
            cookie = {
                name: cookieData[0],
                value: cookieData[1]
            };
            expect(cookie.name).to.be.ok.and.equal("connect.sid");
            expect(cookie.value).to.be.ok;
        });

        it("Ruta protegida: Debe enviar la ruta que corresponde al usuario y desestructurarla", async function () {
            // Given
            const headers = {
                Cookie: `${cookie.name}=${cookie.value}`
            };

            // When
            const response = await requester.get("/api/auth/user").set(headers);

            // Then
            expect(response.statusCode).to.be.equal(200);
            expect(response.body.email).to.be.ok.and.equal(this.mockUser.email);
        });
    });
    describe("Test de cart", async function () {
        it("Debería obtener un carro por ID", async function () {

            const response = await requester.get(`/api/carts/${cartId}`);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('_id').to.equal(cartId);
            expect(response.body).to.have.property('cart').to.be.an('array');
            // Añade más expectativas según la respuesta esperada
        });
        it("Debería actualizar un carro con un producto", async function () {
            const response = await requester.put(`/api/carts/${cartId}/products/${productId}`);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            // Añade más expectativas según la respuesta esperada
        });

        it("Debería eliminar un producto de un carro", async function () {
            const response = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            // Añade más expectativas según la respuesta esperada
        });



        it("Debería eliminar un carro por ID", async function () {
            const response = await requester.delete(`/api/carts/${cartId}`);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.be.an('object');
            // Añade más expectativas según la respuesta esperada
        });
    });
    after(async function () {
        const headers = {
            Cookie: `${cookie.name}=${cookie.value}`
        };
        if (productId) {
            // Elimina el producto (ajusta la URL y método según tu implementación)
            let result =await requester.delete(`/api/products/${productId}`).set(headers);
        }
        if (userId) {
            // Elimina el carro (ajusta la URL y método según tu implementación)
            let result =await requester.delete(`/api/auth/${userId}`).set(headers);
        }
        
    });
});


