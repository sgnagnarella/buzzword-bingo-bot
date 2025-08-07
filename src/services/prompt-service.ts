"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, limit, orderBy } from "firebase/firestore";

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
    const q = query(collection(db, "prompts"), where("text", "==", promptAndResponse.text), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        await addDoc(collection(db, "prompts"), {
            ...promptAndResponse,
            createdAt: new Date(),
        });
    }
    return;
  } catch (error) {
    console.error("Error saving prompt: ", error);
  }
}
