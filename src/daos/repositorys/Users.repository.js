const UserDto = require('../dto/users.dto')
class UserRepository{
    constructor(dao){
        this.dao = dao;
    }
    getUserByEmail = async (email) => {
        try {
            return await this.dao.getUser(email);
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    createUser = async (userData) => {
        try {
            const userDto = new UserDto(userData)
            return await this.dao.saveUser(userDto);
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    getUserbycarrito = async (idCarrito) => {
        try {
            return this.dao.getUserbycarrito(idCarrito) 
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    updateUser = async (userId, updatedUserData) => {
        try {
            const updatedUser = await this.dao.updateUser(userId, updatedUserData);
            return updatedUser;
        } catch (err) {
            console.error(err);
            return null;
        }
    };
    getUserByToken = async (token) => {
        try {
            return await this.dao.getUserByToken(token);
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    deleteUser = async (_id) => {
        try {
            return await this.dao.deleteUser({ _id: _id });
        } catch (err) {
            console.log(err);
            return null;
        }
    };

}
module.exports=UserRepository