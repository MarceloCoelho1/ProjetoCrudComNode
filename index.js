const express = require('express')
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser')
const session = require('express-session')
const hbs = require('express-handlebars')


// CONFIGURAÇÃO DO HANDLEBARS
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended:false}))

const Usuario = require('./models/Usuario')

app.use(session({
    secret: 'CriarUmaChaveQualquer',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req, res)=>{
    if(req.session.errors){
        var arrayErros = req.session.errors;
        req.session.errors = "";
        return res.render('index', {NavActiveCad:true, error: arrayErros});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('index', {NavActiveCad:true, MsgSuccess: true});
    }

    res.render('index', {NavActiveCad:true});
})

app.get('/users', (req, res)=>{
    Usuario.findAll().then(function(valores){
        if(valores.length > 0) {
            return res.render('users', {NavActiveUsers:true, table: true, usuarios: valores.map(valores => valores.toJSON())});
        }else {
            res.render('users', {NavActiveUsers:true, table: false})
        }
    }).catch(function(err){
        console.log(`Ops, houve um problema: ${err}`);
    })
    
})

app.post('/edit', (req, res)=>{
    var id = req.body.id;
    Usuario.findByPk(id).then(function(dados){
        return res.render('edit', {error:false, id: dados.id, nome: dados.nome, email: dados.email})
    }).catch(function(err){
        console.log(`Ops, houve um erro: ${err}`)
        return res.render('edit', {error: true, problema: 'Não é possivel editar esse registo'})
    })
    
})

app.post('/cad', (req, res)=>{
    var nome = req.body.nome;
    var email = req.body.email;

    const erros = [];

    nome = nome.trim(); // remove espaços em branco
    email = email.trim(); // remove espaços em branco


    nome = nome.replace(/[^A-zÀ-ú\s]/gi, ''); // limpar o nome de caracteres especias
    
    // verificando se o campo está vazio
    if(nome == '' || typeof nome == undefined || nome == null) {
        erros.push({mensagem: "CAMPO NOME NÃO PODE SER VAZIO!"})
    }
    
    // verificando se o nome é válido
    if(!/^[A-Za-záàâãéèêíóôõúcñÁÀÂÃÉÈÌÓÒÕÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem: "NOME INVÁLIDO"})
    }

    if(email == '' || typeof email == undefined || email == null) {
        erros.push({mensagem: "CAMPO E-MAIL NÃO PODE SER VAZIO!"})
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erros.push({mensagem: "CAMPO E-MAIL INVÁLIDO"})
    }

    if(erros.length > 0 ) {
        console.log(erros);
        req.session.errors = erros;
        req.session.success = false;
        return res.redirect('/');
    }

    Usuario.create({
        nome: nome,
        email: email.toLowerCase()
    }).then(function(err){
        console.log('validação realizada com sucesso');
        req.session.success = true;
        return res.redirect('/');
    }).catch(function(err){
        console.log(`Ops, houve um erro: ${err}`)
    })

    
})

app.post('/update', function(req, res) {
    var nome = req.body.nome;
    var email = req.body.email;

    const erros = [];

    nome = nome.trim(); // remove espaços em branco
    email = email.trim(); // remove espaços em branco


    nome = nome.replace(/[^A-zÀ-ú\s]/gi, ''); // limpar o nome de caracteres especias
    
    // verificando se o campo está vazio
    if(nome == '' || typeof nome == undefined || nome == null) {
        erros.push({mensagem: "CAMPO NOME NÃO PODE SER VAZIO!"})
    }
    
    // verificando se o nome é válido
    if(!/^[A-Za-záàâãéèêíóôõúcñÁÀÂÃÉÈÌÓÒÕÚÇÑ\s]+$/.test(nome)){
        erros.push({mensagem: "NOME INVÁLIDO"})
    }

    if(email == '' || typeof email == undefined || email == null) {
        erros.push({mensagem: "CAMPO E-MAIL NÃO PODE SER VAZIO!"})
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erros.push({mensagem: "CAMPO E-MAIL INVÁLIDO"})
    }

    if(erros.length > 0 ) {
        console.log(erros);
        return res.status(400).send({status: 400, erro: erros})
    }

    Usuario.update({
        nome: nome,
        email: email.toLowerCase()
    }, 
    {
        where: {
            id: req.body.id
        }
    }).then(function(resultado){
        console.log(resultado)
        return res.redirect('/users')
    }).catch(function(err){
        console.log(err);
    })
})

app.post('/del', function(req, res){
    Usuario.destroy({
        where: {
            id: req.body.id
        }
    }).then(function(retorno){
        return res.redirect('/users')
    }).catch(function(err){
        console.log(err)
    })
})

app.listen(PORT, (err) =>{
    if(err) {
        throw err
    } else {
        console.log('Servidor rodando em http://localhost:' +PORT)
    }

});