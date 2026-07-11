import { adminDb } from "./firebase/admin";
import type { PortfolioProject } from "./types";

const COLLECTION = "portfolio";

function collection() {
  return adminDb.collection(COLLECTION);
}

export async function getProjects(): Promise<PortfolioProject[]> {
  try {
    const snap = await collection().orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PortfolioProject);
  } catch (err) {
    console.error("getProjects failed:", err);
    return [];
  }
}

export async function getProject(id: string): Promise<PortfolioProject | null> {
  const snap = await collection().doc(id).get();
  return snap.exists ? ({ id: snap.id, ...snap.data() } as PortfolioProject) : null;
}

export async function createProject(
  data: Omit<PortfolioProject, "id" | "createdAt">
): Promise<PortfolioProject> {
  const ref = collection().doc();
  const project: Omit<PortfolioProject, "id"> = {
    ...data,
    createdAt: new Date().toISOString(),
  };
  await ref.set(project);
  return { id: ref.id, ...project };
}

export async function updateProject(
  id: string,
  data: Partial<Omit<PortfolioProject, "id" | "createdAt">>
): Promise<PortfolioProject | null> {
  const ref = collection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  await ref.set(data, { merge: true });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() } as PortfolioProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const ref = collection().doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
