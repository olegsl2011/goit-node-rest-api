import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contactsList = await contactsServices.getContactsList();
    res.status(200).json(contactsList);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getContact = async (req, res) => {
  try {
    const contact = await contactsServices.getContactById(req.params.id);
    if (!contact) {
      throw HttpError(404);
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const removedContact = await contactsServices.removeContact(req.params.id);
    if (!removedContact) {
      throw HttpError(404);
    }
    res.json(removedContact);
  } catch (error) {
    console.error("Error deleting contact:", error);
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      throw HttpError(400, "Name, email, and phone are required");
    }

    const newContact = await contactsServices.addContact({
      name,
      email,
      phone,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (name || email || phone) {
      const updated = await contactsServices.updateContactById(
        req.params.id,
        req.body
      );
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } else {
      throw HttpError(400, "Body must have at least one field");
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      throw HttpError(400, "Missing field favorite");
    }

    const updatedContact = await contactsServices.updateFavoriteStatus(
      req.params.id,
      favorite
    );
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.json(updatedContact);
  } catch (error) {
    console.error("Error updating favorite status:", error);
    const { status = 500, message = "Internal Server Error" } = error;
    res.status(status).json({ message });
  }
};
