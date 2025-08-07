"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, limit, orderBy, serverTimestamp } from "firebase/firestore";

export interface PromptAndResponse {
  text: string;
  response: string;
}

export async function getPrompts(): Promise<PromptAndResponse[]> {
  try {
    const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const prompts: PromptAndResponse[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      prompts.push({ text: data.text, response: data.response });
    });
    return prompts;
  } catch (error) {
    console.error("Error getting prompts: ", error);
    return [];
  }
}

export async function savePrompt(promptAndResponse: PromptAndResponse): Promise<void> {
    if (!promptAndResponse.text || promptAndResponse.text.trim() === '') {
        return;
    }

  try {
    // To avoid complex Firestore indexing, we'll save the prompt without checking for duplicates.
    // The UI will handle displaying the latest version.
    await addDoc(collection(db, "prompts"), {
        text: promptAndResponse.text,
        response: promptAndResponse.response,
        createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving prompt: ", error);
  }
}
