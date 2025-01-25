import {initializeApp} from "firebase/app"
import {get, getDatabase,onValue,query,ref,set,update,increment,onChildChanged} from "firebase/database"
import express from "express"
import {renderFile} from "ejs"
import {Server} from "socket.io"
import { createServer } from 'node:http';
import {config} from "dotenv"
import cors from "cors"
import ratelimiter from "express-rate-limit"




config()

const app=express()
const MainServer=createServer(app)
const io=new Server(MainServer)

app.use(cors({origin:"http://localhost:5000"}))
app.use(express.json())
app.use("/read_book",ratelimiter({
    windowMs:1000 * 60 * 30,
    limit:1000
}))

app.set('view engine', "ejs")
app.engine('html', renderFile);

// Firebase inicializálása
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

app.get("/",async (req,res)=>{
    var sortedmap=SortMap(await GetAllUsers())
        
    res.render("index.html",{"data":sortedmap})
    return
})

app.post("/read_book",(req,res)=>{
    let id=req.body["id"]
    
    update(ref(RTDB,`leaderboard/${id}`),{"num":increment(1),})
    io.emit("change",id)

    return res.sendStatus(200)
    
})

app.post("/new_reader",(req,res)=>{
    let id=req.body["id"]

    set(ref(RTDB,`leaderboard/${id}`),{"num":0})

    io.emit("newID",id)
})

io.on("connection",(socket)=>{
    console.log("SocketIO: "+"Egy felhasználó csatlakozott")
})



MainServer.listen(5000)

function SortMap(data){
    var processed=new Map()

    data.forEach(function(e){
        processed.set(e.key,e.val()["num"])
    })

    const sortedEntries = Array.from(processed).sort((a, b) => {
        return b[1] - a[1]
      });

      
      const sortedMap = new Map(sortedEntries)
      
      return sortedMap
}

async function GetAllUsers(){
    return (await get(query(ref(RTDB,"leaderboard"))))
}