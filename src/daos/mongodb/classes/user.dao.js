const UserModel = require("../models/users.model");


class User {
    getUser = async (email) => {
        try {
            return await UserModel.findOne({ email: email });
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    getUserByToken = async (token) => {
        try {
            return await UserModel.findOne({ resetToket: token });
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    getUserbycarrito = async (idCarrito) => {
        try {
            return await UserModel.findOne({ cartId: idCarrito });
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    saveUser = async (userData) => {
        try {
            return await UserModel.create(userData);
        } catch (err) {
            console.log(err);
            return null;
        }
    };
    updateUser = async (userId, updatedUserData) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
            return updatedUser;
        } catch (err) {
            console.error(err);
            return null;
        }
    };
    deleteUser = async (_id) => {
        try {
            return await UserModel.deleteOne({ _id: _id });
        } catch (err) {
            console.log(err);
            return null;
        }
    };
}
module.exports = User;
