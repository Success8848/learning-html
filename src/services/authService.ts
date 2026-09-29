import { mockRequest } from "./api";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirebaseClient } from "@/backend/firebaseClient";

export const authService = {
  login: async (email: string, password: string) => {
    const client = getFirebaseClient();
    if (!client) return mockRequest({ id: "USR-001", name: "Suman Shrestha", email, role: "ADMIN" as const });
    const credential = await signInWithEmailAndPassword(client.auth, email, password);
    return { id: credential.user.uid, name: credential.user.displayName ?? email, email, role: "OPERATOR" as const };
  },
  register: async (name: string, email: string, role: "ADMIN" | "OPERATOR", password: string) => {
    const client = getFirebaseClient();
    if (!client) return mockRequest({ id: crypto.randomUUID(), name, email, role });
    const credential = await createUserWithEmailAndPassword(client.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return { id: credential.user.uid, name, email, role };
  },
  logout: async () => {
    const client = getFirebaseClient();
    if (client) await signOut(client.auth);
    return mockRequest({ success: true });
  },
};