const mongoose = require('mongoose')

function connecttodb() {

  mongoose.connect("").then(() => {
    console.log("connect to db");

  })
}

module.export = connecttodb