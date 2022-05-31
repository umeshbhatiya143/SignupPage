const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
//to apply css and images make it static
//also drop these files inside public folder
app.use(express.static("public"));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

//callback
app.post('/',(req,res)=>{

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    //create object to send data to mailchimp
    const data = {
        //create array of objects
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                },
                update: true
            }
        ]
    };
   //convert this data into json
   const jsonData = JSON.stringify(data);

    //console.log(firstName,lastName,email);

    //make request
    const listId = "6d4890b84f"
    const apiKey = "653de49aa2bacb30f3f5c3b724e92882-us11";
    const url = "https://us11.api.mailchimp.com/3.0/lists/" + listId;

    const options = {
       method: "POST",
       auth: "umesh:"+apiKey
    }

    const request = https.request(url,options,(response)=>{

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }


          response.on("data",(data)=>{
              console.log(JSON.parse(data));
          })
    })

    request.write(jsonData);
    request.end();
});

//when failure occure
app.post("/failure",(req,res)=>{
    res.redirect("/");
});


//when deploying on heroku we have to change port dynamically
app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running on port 3000.");
});


//find that from mailchimp website
// api key - 653de49aa2bacb30f3f5c3b724e92882-us11
//audience id - 6d4890b84f