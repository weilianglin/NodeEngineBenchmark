var fs = require('fs');
var path = require('path');
var testVersion = '1.0.2';
var folder = path.join(process.cwd(), 'sunspider-' + testVersion);
var files = fs.readdirSync(folder);
var totalTime = 0, subCounter = 1;
var vm = require('vm');
var d = new Date();
var timeString = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-" + d.getHours() + "." + d.getMinutes() + "." + d.getSeconds();

{
  var script = fs.readFileSync("./octane.js") + "";
  var sandbox = {print: console.log};
  var context = vm.createContext(sandbox);
  vm.runInContext(script, context);
  console.log("------\n");
}

var scores = [];

setInterval(function(){
  if (subCounter == 10) {
    console.log("Total SunSpider AVG. Time", totalTime/ 10);
    var result_file = "sunspider-results-" + timeString + ".js";
    console.log("Results are located at ./" + result_file);
    fs.writeFileSync(result_file, "var output = ");
    fs.appendFileSync(result_file, JSON.stringify(scores));
    process.exit(0);
  }

  var index = subCounter++;
  var score = {};
  for(var counter = 0;counter < files.length; counter++) {
    var file = files[counter];

    if (path.extname(file) != '.js') continue;

    var script = fs.readFileSync(folder + path.sep + file) + "";
    var sandbox = {print: console.log};
    var context = vm.createContext(sandbox);

    var subTotal = vm.runInContext("var START_TIME=Date.now();" + script + ";Date.now()-START_TIME", context);
    score[path.basename(file, ".js")] = subTotal;
    totalTime += subTotal;
  }
  scores[index-1] = score;
}, 123);
