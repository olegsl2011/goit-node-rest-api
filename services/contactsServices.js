import Contact from "../models/contact.js";

export const getContactsList = async () => {
  return await Contact.findAll();
};

export const getContactById = async (id) => {
  return await Contact.findByPk(id);
};

export const addContact = async ({ name, email, phone }) => {
  return await Contact.create({ name, email, phone });
};

export const updateContactById = async (id, body) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.update(body);
  return contact;
};

export const removeContact = async (contactId) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const updateFavoriteStatus = async (id, favorite) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;
  await contact.update({ favorite });
  return contact;
};
