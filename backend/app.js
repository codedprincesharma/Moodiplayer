const express = require('express')
const connectdb = require('./db/db')

connectdb()

const app = express()
app.get('/', (req, res) => {
  res.send('hello')
})




app.listen(3000, () => {
  console.log('server running on port number 3000');

})