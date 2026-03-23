import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./src/utils/db.js";
import authRoutes from "./src/routes/authRouter.js";
import cartRoute from "./src/routes/cartRouter.js";
import orderRoute from "./src/routes/orderRouter.js";
import restaurantRoutes from "./src/routes/restaurantRouter.js";
import menuItemRoute from "./src/routes/menuItemRouter.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app=express();
app.use(cookieParser())


app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/cart", cartRoute)
app.use("/api/menuitem", menuItemRoute)
app.use("/api/order", orderRoute)
app.use("/api/restaurant", restaurantRoutes)


connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("connect to DB server is running on port 3000")
    })
}).catch((error)=>{
  console.log(error, "there is some issue in index.js file ")
})