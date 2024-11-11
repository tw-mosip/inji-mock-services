const express = require("express");
const app = express();
const port = 3008;

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
