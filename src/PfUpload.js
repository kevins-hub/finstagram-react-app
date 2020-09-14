import React, { useState } from 'react'
import { Button } from "@material-ui/core";
import { firebase, auth } from "firebase";
import { storage, db } from "./firebase";
import './PfUpload.css';


function PfUpload({user}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

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
                        
                        user.updateProfile({
                            photoURL: url
                        })



                        /*
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            imageUrl: url,
                            username: username

                        });
                        */
                    
           
                    })
                    .catch((error) => alert(error.message))
            }

        );
    };
    
    return (
        <div className="pfupload">

            {/* I want to have....*/}

            {/*Caption input */}

            {/*File picker */}

            {/*Post button*/}
            <p>Upload a Profile Picture!</p>
            <progress value={progress} max="100" className="pfupload__progress" />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
    
        </div>
    )
}

export default PfUpload
