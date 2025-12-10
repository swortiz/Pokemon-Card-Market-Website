import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface Credential extends mongoose.Document {
  username: string;
  hashedPassword: string;
  cart: any[];
}

const credentialSchema = new mongoose.Schema<Credential>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    cart: {
      type: [Object],
      default: []
    }
  },
  { collection: "user_credentials" }
);

const credentialModel = mongoose.model<Credential>(
  "Credential",
  credentialSchema
);

//Create
async function create(username: string, password: string): Promise<Credential> {
  const existing = await credentialModel.findOne({ username });
  if (existing) throw new Error("Username already taken");

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new credentialModel({
    username,
    hashedPassword: hashed,
    cart: []
  });

  return newUser.save();
}

//Verifies
async function verify(username: string, password: string): Promise<string> {
  const user = await credentialModel.findOne({ username });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) throw new Error("Invalid credentials");

  return user.username;
}
export const CredentialModel = credentialModel;
export default { create, verify };

