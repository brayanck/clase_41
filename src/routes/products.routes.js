const router = require('express').Router()
const {
    getProductController,
    guardarProductController,
    eliminarProductoController,
    actualizarProductController,
    paginateController,
    mokingProductController
} = require("../controller/products.controller");

router.get("/mockingproducts", mokingProductController);
router.get("/", paginateController);
router.get("/:pid", getProductController);
router.post("/", guardarProductController);
router.delete("/:pid", eliminarProductoController);
router.put("/:pid", actualizarProductController);

module.exports=router