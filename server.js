var express = require('express')
var app = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bodyParser = require('body-parser');
// var path = require('path');
// app.use(express.static(__dirname + '/static'));
// configure body-parser to read JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');


var CompanySchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: {type: String, default:''},
    employees: [{ type: Schema.Types.ObjectId, ref: 'Employee'}]
}, {timestamps: true})

var EmployeeSchema = new mongoose.Schema({
    name: {type:String, required: true},
    __company: {type: Schema.Types.ObjectId, ref: 'Company'}
})

mongoose.model('Company', CompanySchema);
mongoose.model('Employee', EmployeeSchema);

var Company = mongoose.model('Company')
var Employee = mongoose.model('Employee')

var dbURI = 'mongodb://localhost/companies'
mongoose.connect(dbURI);


app.get('/', function(req, res){
    Company.find({}).populate('Employee')
        .exec(function(err, employees){
            res.json({msg: "Success", data: employees})
        })

})

app.get('/new/:name/:loc', function(req, res){
    Company.create({name: req.params.name, location: req.params.loc}, function(err, success){
        if (err) {errors: err.errors}
        res.redirect('/')
    })
})
app.get('/:name', function(req,res){
    Company.findOne({name:req.params.name}, function(err, companies){
        if (err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
        }
        else{
            res.json({message: "Success", data: companies})
        }
    })
})

app.get('/:name/new/:emp', function(req, res){
    Company.findOne({name: req.params.name}, function(err, company){
        var employees = new Employee(req.Body);
        employees._Company = company._id;
        company.employee.push(employees);
        employee.save(function(err){
            company.save(function(err){
                if(err) {console.log('Error')}
                else {
                    res.redirect('/')
                }
            })
        })
    })
})


app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
});

app.listen(8000, () => {
    console.log("listening on port 8000");
});
