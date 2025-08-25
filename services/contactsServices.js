import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

async function getContactsList() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContactsList();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContactsList();
    let removedContact = null;

    const updatedContacts = contacts.filter((contact) => {
      if (contact.id === contactId) {
        removedContact = contact;
        return false;
      }
      return true;
    });

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return removedContact;
  } catch (error) {
    console.error("Error removing contact:", error);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContactsList();
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
    return null;
  }
}

async function updateContact(contactId, name, email, phone) {
  try {
    const contacts = await getContactsList();
    const contactIndex = contacts.findIndex((c) => c.id === contactId);

    if (contactIndex === -1) {
      return null;
    }

    const updatedContact = {
      ...contacts[contactIndex],
    };

    if(name) updatedContact.name = name;
    if(email) updatedContact.email = email;
    if(phone) updatedContact.phone = phone;

    contacts[contactIndex] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
}

export default { getContactsList, removeContact, getContactById, addContact, updateContact };
