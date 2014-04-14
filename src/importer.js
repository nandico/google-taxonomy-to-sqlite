/**
 * Main arguments for command line enviroment.
 */

var inputFilename = process.argv[2];
var outputFilename = process.argv[3];

var inputPath = "./input_files/";
var outputPath = "./output_files/";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(outputPath + outputFilename);

var dict = require("dict");
var d = dict();

var pkId = 1;

main();

function main()
{
	utils();

	createTable();

	openInputFile(inputPath + inputFilename);
}

/**
 * Create taxonomy table.
 */

function createTable()
{
	db.serialize(function()
	{

		var sqlDrop = '' + 
					' DROP TABLE IF EXISTS taxonomy ';

		db.run(sqlDrop);

		var sqlCreate = '' + 
					' CREATE TABLE taxonomy ( ' +  
						' "id" INTEGER PRIMARY KEY  NOT NULL  UNIQUE , ' + 
						' "parent" INTEGER, ' + 
						' "level" INTEGER NOT NULL , ' + 
						' "name" TEXT NOT NULL , ' + 
						' "path" TEXT NOT NULL ) ';

		db.run(sqlCreate);
	});
}

/**
 * Open input file for processing.
 */

function openInputFile(filename)
{
	var fs = require("fs");
	var lazy = require("lazy");

	var processor = new lazy(fs.createReadStream(filename))
		.on('end', handleEndOfFile)
		.lines
		.forEach(readLine);
}

/**
 * End of file message.
 */

function handleEndOfFile()
{
	console.log("");
	console.log("----------------------------------------");
	console.log("Please wait.. executing sqlite3 queue...");
	console.log("----------------------------------------");
}

/**
 * Read a single line from input file.
 */

function readLine(line)
{
	console.log("Processing line: ", line.toString());

	var fullpath = line.toString();
	var comments = fullpath.split("#");
	var levels = comments[0].trim().split(" > ");

	if(levels[0].length > 0)
	{
		for(var level = 0; level < levels.length; level++)
		{
			var name = levels[level];
			var parent = getParent(levels, level);

			createItem(name, parent, level, getPath(levels, level));
		}

	}

}

/**
 * Get a path according with the level
 */

 function getPath(levels, level)
 {
 	var myLevels = levels.slice(0, level + 1);
 	return myLevels.join(" > ");
 }



/**
 * Get the parent node.
 */

function getParent(levels, level)
{
	// root item
	if(level == 0) return null;

	var myLevels = levels.slice(0, levels.length - 1);
	var key = myLevels.join(" > ");

	return d.get(key);
}

/**
 * Get the parent node.
 */

 function createItem(itemName, itemParent, itemLevel, itemPath)
 {
 	if(d.has(itemPath))
 	{
 		return; 
  	}

 	sqlInsert = '' + 
 				' INSERT INTO taxonomy ' + 
 					' ( id, name, parent, level, path ) ' + 
 				' VALUES ' + 
 					' ( ?, ?, ?, ?, ? )';

	db.serialize(function()
	{
	 	db.run(sqlInsert, pkId, itemName, itemParent, itemLevel, itemPath);
		d.set(itemPath, pkId);

	 	pkId ++;

	}); 					
}

 /**
 * String trim utilities.
 */ 
function utils()
{
	String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
	String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};
	String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};
	String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
}