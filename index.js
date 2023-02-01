const express = require("express");
const cors = require("cors");
const fileupload=require("express-fileupload")
const User= require("./schema.js")
const path = require("path")
const app = express();
app.use(fileupload());
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
mongoose.set('strictQuery', true)

const uri = `mongodb+srv://Divyasree:divyasree@cluster0.9kkuiyt.mongodb.net/?retryWrites=true&w=majority`

/* to upload the data in the landing pag*/
app.get("/all",async(req,res)=>{
    try{
        const posts= await User.find().sort({_id:-1});
        res.json(posts);
    }
    catch(err){
        res.status(400).json({
            message:err.message,
        })
    }

})
// Connection to mongo db // connected to InstaClone Cluster0
mongoose.connect(uri,(err)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log("Connected to mongo db Successfully")
    }
})

/* create a post and loading data to mongo*/
app.post("/",async(req,res)=>{
    const {author,location,description} = req.body
    const {image} =req.files
    console.log(author,location,description)
    image.mv("./uploads/"+image.name,async(err)=>{
        if(err){
            res.json({message:err.message})
        }else{
            const userData = new User({

                ...{author,location,description},
                image:image.name
            })
            try{
                const data = await userData.save()
            console.log(data)
            res.json({message:data})
            }
            catch(e){
                res.json({message:e.message})
            }
        }
    })
    
// res.send({
//     status:"Success"
// })
})


/*Creating images api to upload images*/
app.get("/images/:filename",async(req,res)=>{
    res.sendFile(path.join(__dirname,`./uploads/${req.params.filename}`))
})

const port  = 8081 || process.env.PORT
app.listen(port,()=>{console.log("Server is up at 8081....")})