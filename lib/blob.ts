import { initializeApp } from "firebase/app";
import {
	getStorage,
	getDownloadURL,
	uploadBytesResumable,
	ref,
} from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

/**
 * Sends a file to Firebase Storage and returns the url
 * @param data Data in a buffer
 * @param metadata Metadata for the file
 */
export async function createBlob(
	data: Buffer,
	folderLocation: string,
	metadata: {
		type: string;
		name: string;
	}
) {
	const storageRef = ref(storage, `${folderLocation}/${metadata.name}`);
	const snapshot = await uploadBytesResumable(storageRef, data, {
		contentType: metadata.type,
	});
	const downloadURL = await getDownloadURL(snapshot.ref);

	return downloadURL;
}
