import User from "./user.js";
import Contact from "./contact.js";

export const applyAssociations = () => {
  User.hasMany(Contact, { foreignKey: "owner" });
  Contact.belongsTo(User, { foreignKey: "owner" });
};
