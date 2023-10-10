const {generateResetToken} =require("../config/refreshToken")
const sendEmail = require("./email.controler")
const { createHash,isValidPassword} = require('../utils/bcrypts')
const {
  userServices,
} = require("../daos/repositorys/index");
const renderRegisterControllers = (req,res)=>{
    res.render("register", {});
}
const renderLoginControllers = (req, res) => {
    res.render("login", {});
  }
  const logoutControllers =  (req, res) => {
    req.logOut(() => {});
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  }
  const resetPaawordRender= (req, res) => {
    res.render("password",{});
  }
  const resetPaawordFormRender= (req, res) => {
    res.render("formpass",{});
  }
  const deleteUser =async(req,res)=>{
    try{
      let id = req.params.id
      let result = await userServices.deleteUser(id);
      res.json("usuario eliminado")
    }catch(err){
      res.json(err)
    }
  } 
  const resetPaaword= async(req, res) => {
    try{
      // Genera un token de cambio de contraseña y almacénalo en la sesión
    const token = generateResetToken();
    req.session.resetPasswordToken = token;
  
    // Envía el correo electrónico con el enlace de cambio de contraseña
    const email = req.body.email; // El correo del usuario al que enviar el enlace
    const user = await userServices.getUserByEmail(email)
    const pass ={
      resetToket:token
    }
    const update = await userServices.updateUser({_id:user._id},pass)
    const resetLink = `http://localhost:8080/auth/cambiar-password?token=${token}`;
    const toData={
            to: email,
            Text: "hey user",
            subject: 'Restablecer contraseña',
            html: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}`,
    }
    sendEmail(toData)
    res.redirect("/auth/login")
    }catch(err){
      console.log(err)
      res.json(err)
    }
  }
  const cambioContraseña = async(req, res) => {
    const newPassword = req.body.newPassword;
    const tokenWithTimestamp = req.body.token;
    const [token, expirationTime] = tokenWithTimestamp.split(':');
    const currentTime = Date.now();
    const user = await userServices.getUserByToken(tokenWithTimestamp)
    const isMatch=isValidPassword(user,newPassword)
    if(isMatch){
        return res.redirect(`http://localhost:8080/auth/cambiar-password?token=${tokenWithTimestamp}`)
      }
    if (currentTime <= Number(expirationTime)) {
      // El token no ha expirado, puedes permitir el cambio de contraseña aquí
      // Actualiza la contraseña del usuario en tu base de datos

      
      const passwordHas=createHash(newPassword)
      const pass ={
        password:passwordHas
      }
      const update = await userServices.updateUser({_id:user._id},pass)
      // Luego, elimina el token de la sesión
      delete req.session.resetPasswordToken;
  
      res.status(200).json({ message: 'Contraseña cambiada con éxito' });
    } else {
      res.status(400).json({ message: 'Token de restablecimiento de contraseña expirado' });
    }
  }
  const cambiarRole = async(req,res)=>{
     
    try{
      console.log("hola")
      const id = req.params.id
    if(req.user.role =="user"){
      const update = await userServices.updateUser(id,{role:"premium"})
    }
    if(req.user.role =="premium"){
      const update = await userServices.updateUser(id,{role:"user"})
    }
    res.redirect("/auth/logout")
    }catch(err){
      res.json(err)
    }
  }
  const buscarUserIdController = async (req, res) => {
    try {
      const usuarioEmail = req.user.email;
      const usuario = await userServices.getUserByEmail(usuarioEmail);
      req.logger.info(usuario);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      req.logger.info(usuario._id);
      res.json(usuario._id);
    } catch (error) {
      req.logger.warn("Error al obtener el usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
module.exports={
    renderRegisterControllers,
    renderLoginControllers,
    logoutControllers,
    resetPaaword,
    cambioContraseña,
    resetPaawordRender,
    resetPaawordFormRender,
    cambiarRole,
    buscarUserIdController,
    deleteUser
} 