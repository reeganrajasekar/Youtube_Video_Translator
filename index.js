const { default: YoutubeTranscript } = require("youtube-transcript");
const translate = require('@vitalets/google-translate-api');
const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

function data(text) {
    fs.readFile('./data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        fs.writeFile('./data.txt', data+text, err => {
            if (err) {
                console.error(err);
            }
        });
    });
}
app.post("/",(req,res)=>{
    console.log(req.body.url);
    var src="";
    YoutubeTranscript.fetchTranscript(req.body.url).then(
        (text)=>{
            text.map((i)=>{
                src+=i.text
            })
            len = src.length;
            str = 0;
            
            while (true) {
                if(str<=len){
                    translate(src.slice(str,str+4990), {from: 'en',to: 'ta'}).then(re => {
                        data(re.text)
                    }).catch(err => {
                        res.send(err);
                    });
                }else{
                    
                    fs.writeFile('./data.txt', ' ', (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                    res.redirect("/translate?url=https://www.youtube.com/embed/"+req.body.url.replace("https://youtu.be/",""));
                    break;
                }
                str=str+4990;
            }
            
        }
    );
});


app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/translate",(req,res)=>{
    fs.readFile('./data.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.render("translate" , {data:data,link:req.query.url})
    });
})



app.listen(3000)