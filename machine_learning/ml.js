const ml = require('ml-regression');
const moment = require('moment');
var output=[];

var critical_min=5;
var critical_max=9;
var predict=(input,time,callback)=>{
  output.length=0;
  var co=1;
  input.forEach((a)=>{
    output.push(co);
    co+=3;
  });


  const SLR = ml.SLR;
  let regressionModel;
  regressionModel = new SLR(output, input);
  var date=moment(time);


  var i=co;
  var ti=0;

  while(regressionModel.predict(parseFloat(i))>critical_min&&
regressionModel.predict(parseFloat(i))<critical_max)
  {
  	i+=3;
    ti+=3;
  }


  var new_date=date.add(ti,'months');
  callback(new_date.format('MMM YYYY'));
}

module.exports=predict;
