import Contact from "../models/contact.js";

export const getContactsList = async (
  owner,
  { page = 1, limit = 20, favorite } = {}
) => {
  const offset = (page - 1) * limit;

  const whereClause = { owner };
  if (favorite !== undefined) {
    whereClause.favorite = favorite === "true" || favorite === true;
  }

  const { count, rows } = await Contact.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  return {
    contacts: rows,
    totalContacts: count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    hasNextPage: page < Math.ceil(count / limit),
    hasPrevPage: page > 1,
  };
};

export const getContactById = async (id, owner) => {
  return await Contact.findOne({ where: { id, owner } });
};

export const addContact = async ({ name, email, phone, owner }) => {
  return await Contact.create({ name, email, phone, owner });
};

export const updateContactById = async (id, body, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  await contact.update(body);
  return contact;
};

export const removeContact = async (contactId, owner) => {
  const contact = await Contact.findOne({ where: { id: contactId, owner } });
  if (!contact) return null;
  await contact.destroy();
  return contact;
};

export const updateFavoriteStatus = async (id, favorite, owner) => {
  const contact = await Contact.findOne({ where: { id, owner } });
  if (!contact) return null;
  await contact.update({ favorite });
  return contact;
};
