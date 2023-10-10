
const { faker } = require('@faker-js/faker');

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(1),
        Image: faker.image.image(),
        category: faker.commerce.department(),
        owner: faker.database.mongodbObjectId()
    };
}

module.exports = {
    generateProduct,
}




