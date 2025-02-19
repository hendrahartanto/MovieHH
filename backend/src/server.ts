import { port } from "./config";
import app from "./app";

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
