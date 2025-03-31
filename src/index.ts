import express, { Request, Response } from 'express' 
import mongoose from 'mongoose' 
import jsonwebtoken from 'jsonwebtoken' 
import { contentModel, Usermodel,linkModel } from './db'
import { random } from './utils' 
import { jwt_secret } from './config' 
import { userMiddleware } from './middleware' 
import cors from "cors"
const app =express()  
const jwt = jsonwebtoken
app.use(express.json()) 
app.use(cors())
let users = []

// Signup Route
app.post('/api/v1/signup', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
     await Usermodel.create({
      username: username,
      password: password
    }); 
    res.json({
      message: 'good to go!'
    });
  } catch (error) {
    res.json({
      message: 'failed to signup'
    });
  }
});


app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Find a user with the provided credentials.
    const existingUser = await Usermodel.findOne({ username, password });
    if (existingUser) {
        // Generate a JWT token with the user's ID.
        const token = jwt.sign({ id: existingUser._id }, jwt_secret);
        res.json({ token }); // Send the token in response.
    } else {
        // Send error response for invalid credentials.
        res.status(403).json({ message: "Incorrect credentials" });
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const { Link, type, title } = req.body;
    // Create a new content entry linked to the logged-in user.
    await contentModel.create({
        Link:Link,
        type:type, 
        title:title, //@ts-ignore
        userId: req.userId, // userId is added by the middleware.
        tags: [] // Initialize tags as an empty array.
    });

    res.json({ message: "Content added" }); // Send success response.
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId; 
    const contents = await contentModel.find({ userId: userId }).populate("userId", "username");
    res.json(contents); })

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    //@ts-ignore
    await contentModel.deleteMany({ contentId, userId: req.Id });
    res.json({ message: "Deleted" }); })

app.post("/api/v1/share",userMiddleware,async(req,res)=>{
  const share = req.body.share ;   
  const hash = random(10)
  if(share){
        await linkModel.create({//@ts-ignore
          userId:req.userId , 
          hash:hash
        })
      res.json({
          message: "/share/" + hash
        }) ; 
      }
        else{
          await linkModel.deleteOne({ //@ts-ignore
            userID:req.userId 
          })
        } 
        
})  

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    // Find the link using the provided hash.
    const link = await linkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }

    // Fetch content and user details for the shareable link.
    const content = await contentModel.find({ userId: link.userId });
    const user = await Usermodel.findOne({ _id: link.userId });

    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }

    res.json({
        username: user.username,
        content
    }); // Send user and content details in response.
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
