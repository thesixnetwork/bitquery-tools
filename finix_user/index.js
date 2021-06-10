require("dotenv").config()
const fs = require('fs');
const axios = require('axios');
const { upperFirst } = require("lodash");

const start = async() => {
    
    const args =  process.argv.slice(2);
    qName = args[0];
    var queryData = await fs.readFileSync(qName+'.graphql').toString();
    var varData = (fs.existsSync(qName+'.json') ?await fs.readFileSync(qName+'.json').toString() : undefined)
    if(args.length > 1 && varData) {
        for (let index = 1; index < args.length; index++) {
            const v = args[index];
            varData = varData.split("{"+index+"}").join(v)
        }
    }
    query(queryData,varData).then(result=>{
        // console.log(result.data)
        const csvExtractor = require('./'+qName)
        csvExtractor.extract(result.data).then(result=>{
            console.log("ok")
        }).catch(err=>{
            console.log(err)
        })
    })
}

const query = (query,variables) => {
    var vars = variables;
    if(!vars) {
        vars = "{}"
    }
    return new Promise((resolve,reject)=>{
        const instance = axios.create({
            baseURL: process.env.BQR_HOST,
            headers: {'X-API-KEY': process.env.API_KEY}
        });
    
        instance.post('/',{
            "query" : query,
            "variables" :  variables
        }).then(response=>{
            resolve(response)
        }).catch(reject)
    })
}

start()