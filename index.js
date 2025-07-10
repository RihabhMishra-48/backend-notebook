const express = require('express')
const app = express()
const path= require('path')
const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')

app.get('/', function(req,res){
    fs.readdir(`./files`, function(err, files){
        res.render("new", {files:files})
    })
    
})
app.get('/files/:filename', function(req, res) {
    const filePath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filePath, 'utf-8', function(err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', function(req, res) {
    res.render("edit" ,{filename:req.params.filename})
});

app.post('/edit', function(req, res) {
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}` ,function(err){
        res.redirect('/')
    } )
});
app.post('/create', function(req,res){
    fs.writeFile(path.join(__dirname, 'files', `${req.body.title.split(' ').join('')}.txt`), req.body.details, function(err){
    if (err) {
        console.error("Error writing file:", err);
    }
    res.redirect('/');
});

})

app.listen(3000)