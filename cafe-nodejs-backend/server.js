require('dotenv').config();
const app = require('./index');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
