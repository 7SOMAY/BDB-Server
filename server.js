import app from "./app.js";
import {connectDB} from "./config/database.js";

connectDB().catch((e) => console.log(e.message));


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});