import React, { useState } from 'react'
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import './ImageUpload.css';


function ImageUpload({user}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function... go and get a download link
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: user.displayName,
                            pfUrl: user.photoURL

                        });
                    
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }

        );
    };
    
    return (
        <div className="imageupload">

            {/* I want to have....*/}

            {/*Caption input */}

            {/*File picker */}

            {/*Post button*/}

            <progress value={progress} max="100" className="imageupload__progress" />
            <input type="text" placeholder= 'Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
    
        </div>
    )
}

export default ImageUpload
