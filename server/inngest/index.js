import { Inngest } from "inngest";
import User from "../models/user.js";

export const inngest = new Inngest({
  id: "movie-ticket-booking",
  eventKey: process.env.INNGEST_EVENT_KEY,     
  signingKey: process.env.INNGEST_SIGNING_KEY,  
});

// Save user data
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      await User.create({
        _id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        image: image_url,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
);

// Delete user data
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await User.findByIdAndDelete(event.data.id);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);

// Update user data
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      await User.findByIdAndUpdate(id, {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        image: image_url,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
