const o2c = require("objects-to-csv")
var _ = require('lodash');
const tokenMap = require('./token.json')

const extract = (jsonData) => {
    return new Promise((resolve,reject)=>{
        const rows = []
        for (let index = 0; index < jsonData.data.ethereum.smartContractCalls.length; index++) {
            const call = jsonData.data.ethereum.smartContractCalls[index];
            var row = {}
            _.set(row,"smartContractMethod", _.get(call,"smartContractMethod.name"))
            const callArgs = _.get(call,"arguments")
            for (let index = 0; index < callArgs.length; index++) {
                const callArg = callArgs[index];
                _.set(row,getRunningPropperty(row,_.get(callArg,"argument")), toToken(_.get(callArg,"value")))       
            }
            _.set(row,"date", _.get(call,"date.date"))
            _.set(row,"tx_hash", _.get(call,"transaction.hash"))
            rows.push(row)
        }
        const csv = new o2c(rows);
        csv.toDisk('./output.csv').then(result=>{
            resolve(true);
        }).catch(reject)
    })
    

}

const getRunningPropperty  = (row,fieldName) => {

    if(_.get(row,fieldName) === undefined) {
        return fieldName
    }else {
        for (let autoNum = 1;  autoNum++;) {
            if(_.get(row,fieldName+"_"+autoNum) === undefined) {
                return fieldName+"_"+autoNum;
            }
        }
    }
}

const toToken = (address) => {
    return _.get(tokenMap,address.toLowerCase(),address)
}

module.exports = {
    extract
}