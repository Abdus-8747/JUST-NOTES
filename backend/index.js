require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

mongoose.connect(config.connectionString)

const User = require('./models/user.model')
const Note = require('./models/note.model')

const express = require("express")
const cors = require("cors")
const app = express()

const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utils")

app.use(
    cors({
        origin: "*"
    })
)
app.use(express.json());


app.get("/", (req, res) => {
    res.json({ data: "hello from server again" })
})

//Create Account
app.post("/create-account", async(req, res) => {
    const { fullName, email, password } = req.body

    if(!fullName) {
        return res.status(400).json({ error:true, message: "Full Name is required"})
    }

    if(!email) {
        return res.status(400).json({ error:true, message: "Email is required"})
    }

    if(!password) {
        return res.status(400).json({ error:true, message: "Password is required"})
    }

    const isUser = await User.findOne({ email: email })
    if(isUser) {
        return res.json({ error:true, message: "User already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user = new User({
        fullName,
        email,
        password : hashedPassword
    })
    await user.save()

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3000m"
    })

    return res.json({ error:false,user,accessToken, message: "User Created Successfully"})
})

//Login User
app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).json({ error:true, message: "Email is required"})
    }

    if(!password) {
        return res.status(400).json({ error:true, message: "Password is required"})
    }

    const userInfo = await User.findOne({ email: email})

    if(!userInfo) {
        return res.status(400).json({ error:true, message: "User Not Exist"})
    }
    
    const isPassowordCorrect = await bcrypt.compare(password, userInfo.password)

    if(!isPassowordCorrect) {
        return res.status(400).json({ error: true, message: "Invalid Credentials" });
    }
        const user = { user : userInfo}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3000m",
        })

    return res.json({ error:false,user,accessToken, message: "User Logged In Successfully"})
})

//Get User
app.get("/get-user", authenticateToken,async(req,res) => {
    const { user } = req.user

    const isUser = await User.findOne({ _id: user._id })

    if(!isUser)  {
        return res.status(401)
    }

    return res.json({ user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn
    }, message: "Got User"})
})
 
//Add Note
app.post("/add-note", authenticateToken, async(req,res) => {
     const { title,content,tags } = req.body;
     const { user } = req.user
    console.log(user);
    
     if(!title) {
        return res.status(400).json({ error:true, message: "Title is required"})
    }

    if(!content) {
        return res.status(400).json({ error:true, message: "Content is required"})
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        })

        await note.save();
        
        return res.json({ error:false,note, message: "Note Added Successfully"})
    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"})
    }
})

//Edit Note
app.put("/edit-note/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId
    const { title,content,tags,isPinned } = req.body
    const { user } = req.user

    if(!title && !content && !tags) {
        return res.status(400).json({ error:true, message:"No Changes Provided" })
    }
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })

        if(!note) {
        return res.status(400).json({ error:true, message:"Note not found" })
    }

    if(title) note.title = title
    if(content) note.content = content
    if(tags) note.tags = tags
    if(isPinned) note.isPinned = isPinned

    await note.save()
    return res.json({ error:false,note, message: "Note Updated Successfully"})
    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"})
    }
})

//Get All Notes
app.get("/get-all-notes", authenticateToken, async(req,res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })

        return res.json({ error:false,notes, message: "All Notes Retrived Successfully"})

    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"}) 
    }
})

//Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId
    const { user } = req.user

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })

        if(!note) {
        return res.status(400).json({ error:true, message:"Note not found" })
        }

        await Note.deleteOne({ _id: noteId, userId: user._id })

        return res.json({ error:false, message: "Note Deleted Successfully"})
    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"}) 
    }
})

//Update isPinned 
app.put("/update-note-pined/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId
    const { isPinned } = req.body
    const { user } = req.user

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })

        if(!note) {
        return res.status(400).json({ error:true, message:"Note not found" })
    }

    note.isPinned = isPinned || false

    await note.save()
    return res.json({ error:false,note, message: "Note Updated Successfully"})
    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"})
    }
})

//Search Note
app.get("/search-notes", authenticateToken, async(req,res) => {
    const { query } = req.query
    const { user } = req.user
    //console.log("Query:", query);
    //console.log("User ID:", user._id);

    if(!query) {
        return res.status(400).json({ error:true, message:"Search Query is required" })
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ]
        })
 
    return res.json({ error:false,notes: matchingNotes, message: "Note Matched Retrived Successfully"})
    } catch (error) {
        console.error("Error adding note:", error); 
        return res.status(500).json({ error:true,message: "Internal Servar Error"})
    }
})

app.listen(8000)

module.exports = app