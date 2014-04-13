/**
 * Main arguments for command line enviroment.
 */

var inputFilename = process.argv[2];
var outputFilename = process.argv[3];

var inputPath = "./input_files/";
var outputPath = "./output_files/";

//console.log("inputFilename:", inputFilename);
//console.log("outputFilename:", outputFilename);

// entry point
openInputFile(inputPath + inputFilename);

/**
 * Open input file for processing.
 */

function openInputFile(filename)
{
	var fs = require("fs");
	var lazy = require("lazy");

	var processor = new lazy(fs.createReadStream(filename))
		.lines
		.forEach(readLine);
}

/**
 * Read a single line from input file.
 */

function readLine(line)
{
	console.log("Processing line: ", line.toString());
}