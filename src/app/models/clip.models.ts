import firebase from 'firebase/compat/app';

export default interface IClip {
    docID?: string;
    uid: string;
    displayName: string;
    photoUrl?: string;
    title: string;
    fileName: string;
    url: string;
    screenshotUrl: string;
    screenshotFileName: string;
    timestamp: firebase.firestore.FieldValue;
}
