google-taxonomy-to-sqlite
=========================
A node.js + sqlite3 CLI importer for Google Product Taxonomy Files.

The Google Product taxonomy is a tree of categories of products used and updated regularly by Google.
https://support.google.com/merchants/answer/160081

This program is intended to read a TXT version of a Google taxonomy file inserting the data in a relational SQLite database.
Instructions
============
1) npm install the required external packages (sqlite3, dict, lazy).

2) put the TXT taxonomy file into "input_files" folder. MUST BE the TXT version.
Download from http://www.google.com/basepages/producttype/taxonomy.en-US.txt or look for other version in your prefered language/localization.

3) in the correct folder run the command:

```
> node import.js [input_filename] [output_filename]
```
4) Look for the [output_filename] into "output_files" folder.
