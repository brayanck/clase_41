const { productServices, userServices } = require("../daos/repositorys/index");
const CustomError = require("../services/errors/CustomError");
const { generateProduct } = require('../utils/mock')
const {
    generateProductErrorInfo,
} = require("../services/errors/CreationErrorMessage/ProductMessage");
const EErrors = require("../services/errors/enums");
const { ADMIN_EMAIL } = require("../config/config");

const getProductController = async (req, res) => {
    try {
        let producto = req.params.pid;
        let produc = await productServices.getProductById(producto);
        req.logger.info(produc);
        if (produc) {
            res.json(produc);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (err) {
        req.logger.warn(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const guardarProductController = async (req, res, next) => {
    req.logger.info(req.body);
    try {
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                // Verifica si la propiedad es una cadena vacía
                if (req.body[key] === "") {
                    CustomError.createError({
                        name: "Product creation error",
                        cause: generateProductErrorInfo(req.body),
                        message: "Error to create product - TEST",
                        code: EErrors.INVALID_TYPES_ERROR,
                    });
                }
            }
        }
        console.log("product hola")
        let data = req.body;
        if (req.user) {
            const usuario = await userServices.getUserByEmail(req.user.email);
            data.owner = usuario._id;
        } else {
            const admin = await userServices.getUserByEmail(ADMIN_EMAIL);
            data.owner = admin._id;
        }

        const savedProduct = await productServices.createProduct(data);
        res.json(savedProduct);
    } catch (err) {
        // Maneja el error personalizado aquí
        req.logger.warn(err); // Asegúrate de que estás viendo los detalles del error en la consola
        res.status(500).send({ error: err.code, message: err.message });
    }
};

const eliminarProductoController = async (req, res) => {
    try {
        let id = req.params.pid;
        if (req.user.role === "admin") {
            const deletedProduct = await productServices.deleteProduct(id);
            res.json(deletedProduct);
        } else {
            if (req.user.role === "premium") {
                const product = await productServices.getProductById(id);
                const user = await userServices.getUserByEmail(req.user.email);
                if (product && product.owner.equals(user._id)) {
                    const deletedProduct = await productServices.deleteProduct(id);
                    res.json(deletedProduct);
                } else {
                    res.json("No tienes permisos");
                }
            }
        }
    } catch (err) {
        res.json(err);
    }
};
const actualizarProductController = async (req, res) => {
    try {
        let id = req.params.pid;
        let data = req.body;
        const savedProduct = await productServices.restaProduct(id, data);
        res.json(savedProduct);
    } catch (err) {
        res.json(err);
    }
};

const paginateController = async (req, res) => {
    try {
        let limit = parseInt(req.query.limit, 10) || 10
        let page = parseInt(req.query.page, 10) || 1
        let order
        if (req.query.order === 'desc') {
            order = -1
        }
        if (req.query.order === 'asc') {
            order = 1
        }
        let query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        let sortOptions = {};
        if (req.query.order) {
            sortOptions.price = order;
        }
        let products = await productServices.paginacion(query, limit, page, sortOptions);

        res.json(products)
    } catch (err) {
        req.logger.warn(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const mokingProductController = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct())
        }
        res.json(products)
    } catch (err) {
        req.logger.warn(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getProductController,
    guardarProductController,
    eliminarProductoController,
    actualizarProductController,
    paginateController,
    mokingProductController
};
