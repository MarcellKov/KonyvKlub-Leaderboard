import {initializeApp} from "firebase/app"
import {get, getDatabase,onValue,query,ref,set,update,increment,onChildChanged} from "firebase/database"
import express from "express"
import {renderFile} from "ejs"
import {Server} from "socket.io"
import { createServer } from 'node:http';
import {config} from "dotenv"





config()

const app=express()
const MainServer=createServer(app)
const io=new Server(MainServer)

app.use(express.json())

app.set('view engine', "ejs")
app.engine('html', renderFile);

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain:  process.env.authDomain,
    databaseURL:  process.env.databaseURL,
    projectId:  process.env. projectId,
    storageBucket:  process.env.storageBucket,
    messagingSenderId:  process.env.messagingSenderId,
    appId:  process.env.appId,
    measurementId:  process.env.measurementId
};

const FirebaseApp = initializeApp(firebaseConfig);

const RTDB=getDatabase(FirebaseApp)


onChildChanged(query(ref(RTDB,"leaderboard")),(snapshot)=>{
    
    console.log(snapshot.toJSON())
    console.log(snapshot.ref.key)
})

app.get("/",(req,res)=>{
    res.render("index.html",{"title":["a","b"]})
    return
})

app.post("/read_book",(req,res)=>{
    let id=req.body["id"]
    
    update(ref(RTDB,`leaderboard/${id}`),{"num":increment(1)})
    res.send("Success")
    return
})

io.on("connection",(socket)=>{
    console.log("Joined")
})

MainServer.listen(5000)