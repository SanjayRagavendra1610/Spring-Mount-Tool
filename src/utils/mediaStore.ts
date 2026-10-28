import { Student } from "../types/student";

const DB_NAME = "scholargrid_portfolio_media_v1";
const STORE_NAME = "images";
export const MEDIA_REFERENCE_PREFIX = "media://";

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This browser does not support persistent photo storage."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open photo storage."));
  });
}

export async function savePortfolioImage(file: File): Promise<string> {
  const db = await openMediaDatabase();
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error(`Could not save ${file.name}.`));
    transaction.onabort = () => reject(transaction.error || new Error(`Could not save ${file.name}.`));
  }).finally(() => db.close());
  return `${MEDIA_REFERENCE_PREFIX}${id}`;
}

export function collectPortfolioMediaReferences(students: Student[]): string[] {
  const references = new Set<string>();
  const add = (value?: string) => {
    if (value?.startsWith(MEDIA_REFERENCE_PREFIX)) references.add(value);
  };
  for (const student of students) {
    add(student.photoUrl);
    const book = student.storybook;
    add(book?.dreamCareer?.illustrationUrl);
    add(book?.familyPhotoUrl);
    add(book?.grossMotorActivityPhotoUrl);
    add(book?.artworkPhotoUrl);
    add(book?.campusSketchUrl);
    add(book?.classMontagePhotoUrl);
    add(book?.educatorPhotoUrl);
  }
  return [...references];
}

export async function loadPortfolioMediaUrls(references: string[]): Promise<Record<string, string>> {
  if (!references.length) return {};
  const db = await openMediaDatabase();
  const urls: Record<string, string> = {};
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      for (const reference of references) {
        const id = reference.slice(MEDIA_REFERENCE_PREFIX.length);
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result instanceof Blob) urls[reference] = URL.createObjectURL(request.result);
        };
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not load saved portfolio images."));
    });
  } finally {
    db.close();
  }
  return urls;
}
