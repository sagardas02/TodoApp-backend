const express= require("express")
const mongoose = require('mongoose')
const cors=require("cors")
const bodyParser =require("body-parser")

// server PORT is HERE
const port = 5000;

const app= express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["https://sagardas02-todo-app.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));

// connection of Database

// mongoose.connect("mongodb://127.0.0.1:27017/TodoApp", {
//     useNewUrlParser: true,
//     useUnifiedTopology:true,
// }).then( ()=>{
//     console.log("DB connected");
// }).catch( error=>(
//     "error in DB connection", error    //if something error happens this error will show
// ))

mongoose.connect(
process.env.MONGODB_URL ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error.message));
  

//  Creating DataBase Schema 

const TodoPostSchema = new mongoose.Schema({
    TodoTitle: String,
    TodoDescp: String,
})

const TodoPost = mongoose.model("TodoPost", TodoPostSchema );


// Routes


//add route
app.post('/api/add', async (req,res)=>{
    try{
        const Todoposts = new TodoPost(req.body)
        const Addtodoposts = await Todoposts.save();
        res.json(Addtodoposts);
    } catch(error){ 
        res.status(500).json({ error: error.message})
    }
})

// Delete Route
app.delete('/api/delete-todoposts/:id', async (req,res)=>{
    try{
        // const todoposts = new TodoPost(req.body)
        const deletetodoposts = await TodoPost.findByIdAndDelete(req.params.id);
        if(!deletetodoposts){
            return res.status(404).json({ error: 'Todo Post is not found'})
        }
        res.json(deletetodoposts);
    } catch(error){ 
        res.status(500).json({ error: error.message})
    }
})



// view Route
app.get('/api', async (req,res)=>{
    try{
        const todoposts = await TodoPost.find();
        res.json(todoposts);
    } catch(error){ 
        res.status(500).json({ error: error.message})
    }
})

app.get('/api/id/:id', async (req,res)=>{
    try{
        const todoposts = await TodoPost.findById(req.params.id);
        const todoId= req.params.id;
        const updateData= req.body;
        res.json(todoposts);
    } catch(error){ 
        res.status(500).json({ error: error.message})
    }
})


// Update Route
app.put('/api/update-todoposts/:id', async (req,res)=>{
    try{
        const todoposts = await TodoPost.findByIdAndUpdate(req.params.id, req.body,{new:true});
        return res.status(200).json({ msg: 'Successfull', data: todoposts})
    } catch(error){  
         res.status(500).json({ error: error.message})
    }
})




app.listen(port,()=>{
    console.log(`Server is connected on ${port} port`)
})