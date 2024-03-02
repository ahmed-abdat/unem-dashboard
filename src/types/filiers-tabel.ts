import { Timestamp } from "firebase/firestore/lite";

export type Filiers = {
    url : string;
    name : string
} 

export type Institutions = {
    id? : string;
    name : string;
    flieres : Filiers[]
}