const router = require('express').Router()
const {actualizarCarroController,obtenerCarroController,buscarCarroIdController,eliminarProductoController,eliminarCarroController,comprar}=require('../controller/carts.controller')

router.get("/:cid",obtenerCarroController);
router.delete("/:cid",eliminarCarroController);
router.get('/',buscarCarroIdController);
router.delete("/:cid/products/:pid",eliminarProductoController);
router.put("/:cid/products/:pid", actualizarCarroController);
router.get("/:cid/purchase",comprar)
module.exports=router