var express = require('express');
var router = express.Router();
var fs = require("fs");

let severItemArray = [];

let fileManager = {
  read: function() {
    if (fileManager.validData())
    {
      var rawdata = fs.readFileSync('objectdata.json');
      let goodData = JSON.parse(rawdata);
      severItemArray = goodData;
    }
  },

  write: function() {
    let data = JSON.stringify(severItemArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) 
    {
      return false;
    }
    else
    {
      return true;
    }
  }
};


let ItemObject = function (pTitle,pPicture, pType, pCost, pDescription, pURL) {
  this.ID = Math.random().toString(16).slice(5);
  this.Title = pTitle;
  this.Picture = pPicture;
  this.Type = pType;
  this.Cost = pCost;
  this.Description = pDescription;
  this.URL = pURL;
}



/*
severItemArray.push(new ItemObject("Handmade plate", "<img src='public/image/handmadeplate.jpg' alt='plate'>", "Kitchen", "6", "cute plate", "https://www.bellevuecollege.edu/"));
severItemArray.push(new ItemObject("Chick handmade crochet", "<img src='public/image/hiyoko.jpg' alt='Hiyoko'>", "Hobby", "2", "hand made cute item", "https://www.bellevuecollege.edu/"));
severItemArray.push(new ItemObject("Ferrari", "<img src='public/image/ferrari.jpg' alt='ferrari'>", "Other", "250000", "ferrari", "https://www.bellevuecollege.edu/"));
*/

if(!fileManager.validData()) 
{
  severItemArray.push(new ItemObject("Handmade plate", "", "Kitchen", "6", "cute plate", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Chick handmade crochet", "", "Hobby", "2", "hand made cute item", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Ferrari", "", "Other", "250000", "ferrari", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Handmade plate", "", "Kitchen", "6", "cute plate", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Chick handmade crochet", "", "Hobby", "2", "hand made cute item", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Ferrari", "", "Other", "250000", "ferrari", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Handmade plate", "", "Kitchen", "6", "cute plate", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Chick handmade crochet", "", "Hobby", "2", "hand made cute item", "https://www.bellevuecollege.edu/"));
  severItemArray.push(new ItemObject("Ferrari", "", "Other", "250000", "ferrari", "https://www.bellevuecollege.edu/"));
  fileManager.write();
}
else
{
  fileManager.read(); // do have prior movies so load up the array
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all item data. */
router.get('/getAllItems', function(req, res) {
  fileManager.read();
  res.status(200).json(severItemArray);
});

/* Add one new item */
router.post('/AddItems', function(req, res) {
  // console.log("add item server");
  const newItem = req.body;
  severItemArray.push(newItem);
  fileManager.write();
  res.status(200).json(newItem);
});

/* Delete one item */
router.delete('/DeleteItem/:ID', (req, res) =>{

  const delID = req.params.ID.slice(1);
  console.log(delID);
  let found = false;
  let pointer = GetArrayPointer(delID);
  if (pointer == -1)
  {
    console.log("not found");
    return res.status(500).json({
      status: "error: no such ID"
    });
  }
  else
  {
    severItemArray.splice(pointer, 1)
    fileManager.write();
    res.send('Item with ID: ' + delID+ 'delted!')
  }
  // newItem = req.body;
  // severItemArray.push(newItem);
  // res.status(200).json(newItem);
  // Do we need this three line?
});

function GetArrayPointer(localID){
  for (let i = 0; i < severItemArray.length; i++){
    //console.log(localID +' and' + severItemArray[i].ID);
    if (localID === severItemArray[i].ID)
    {
      return i;
    }
  }

  return -1
}



module.exports = router;
