const router = require("express").Router();
const passport = require("passport");
const { renderRegisterControllers,deleteUser, renderLoginControllers, logoutControllers,resetPaaword,cambioContraseña,resetPaawordRender,resetPaawordFormRender, cambiarRole,buscarUserIdController} = require('../controller/auth.controllers');
const { isAuthenticated } = require("../utils/auth");
router.get("/cambiar-password",resetPaawordFormRender)
router.get("/password-reset",resetPaawordRender)
router.post('/enviar-correo-cambio-contrasena',resetPaaword);

router.post('/cambiar-contrasena', cambioContraseña);


router.get("/register", renderRegisterControllers);
router.get('/login', renderLoginControllers);
router.get("/logout", logoutControllers);
router.post("/register/crear", passport.authenticate("local-register", {
    passReqToCallback: true 
}),(req,res)=>{
    res.send(req.result)
});
router.post("/login/crear", passport.authenticate("local-login", {
    passReqToCallback: true
}),(req,res)=>{
    res.status(200).send("hola")
})
router.get("/github", passport.authenticate("github", {
    scope: ["user:email"],
    session: false
}))
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: "/perfil",
    failureRedirect: '/'
}));

router.get('/user',isAuthenticated,(req,res)=>{
    res.json(req.user);
})

router.get("/premium/:id", cambiarRole)
router.get("/buscarId",buscarUserIdController)
router.delete("/:id",deleteUser)

module.exports=router