import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

const upload = async (file) => {
    const date = new Date().toISOString(); // Format timestamp dengan baik
    const storageRef = ref(storage, `images/${date}_${file.name}`); // Gunakan backtick untuk interpolasi

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress.toFixed(2)}% done`);
            },
            (error) => {
                reject(new Error(`Upload failed with error: ${error.code}`));
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (err) {
                    reject(new Error(`Failed to get download URL: ${err.message}`));
                }
            }
        );
    });
};

export default upload;
