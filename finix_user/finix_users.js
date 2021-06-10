const o2c = require("objects-to-csv")
var _ = require('lodash');

const extract = (jsonData) => {
    return new Promise((resolve,reject)=>{
        const rows = []
        for (let index = 0; index < jsonData.data.ethereum.transfers.length; index++) {
            const call = jsonData.data.ethereum.transfers[index];
            var row = {}
            _.set(row,"address", _.get(call,"sender.address"))
            rows.push(row)
            row = {}
            _.set(row,"address", _.get(call,"receiver.address"))
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