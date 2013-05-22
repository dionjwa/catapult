package catapult;

import sys.io.File;
import haxe.io.StringInput;

import ods.Ods;

using StringTools;

enum OdsType {
	OdsBool;
	OdsString;
	OdsInt;
	OdsFloat;
	OdsNull;
}

//This is ugly, I just want to get it up and running
class OdsRuntimeParser
{
	static var isBoolean :EReg = ~/^(true)|(false)$/i;
	static var isInt :EReg = ~/^[0-9]+$/;
	static var isFloat :EReg = ~/^[0-9]+\.[0-9]+$/;
	
	static function getType (s :String) :OdsType
	{
		s = s.trim();
		if (s == null || s == "") {
			return OdsType.OdsNull;
		} else if (isInt.match(s)) {
			return OdsType.OdsInt;
		} else if (isFloat.match(s)) {
			return OdsType.OdsFloat;
		} else if (isBoolean.match(s)) {
			return OdsType.OdsBool;
		} else {
			return OdsType.OdsString;
		}
	}
	
	//Returns a hash (sheet indexed) of an array of Json objects
	public static function parse <T>(filePath :String) :Map<String, Array<T>>
	{
		var sheets = new Map<String, Array<T>>();
		var ods = new OdsChecker();
		ods.loadODS(new StringInput(File.getContent(filePath)));
		
		for (sheetkey in ods.getSheets()) {
			
			var objects = new Array<T>();
			sheets.set(sheetkey, objects);
			
			var lines = ods.getLines(sheetkey);
			var keys :Array<String> = null;
			var types :Array<OdsType> = [];
			var itemIndex = -1;
			for (line in lines) {
				if (keys == null) {
					keys = line;
				} else if (line[0] == "$EOF") {
					break;
				} else {
					itemIndex++;
					var obj :Dynamic = {};
					
					objects.push(obj);
					for (i in 0...line.length) {
						
						if (i == 0) {
							Reflect.setField(obj, keys[i], [line[i], itemIndex]);
							continue;
						}
						
						//Double check nulls, Bools, and Ints. 
						if (types[i] == null || types[i] == OdsType.OdsNull || types[i] == OdsType.OdsInt) {
							types[i] = getType(line[i]);
						}
						switch(types[i]) {
							case OdsBool:
								Reflect.setField(obj, keys[i], (line[i] == "true"));
							case OdsInt:
								Reflect.setField(obj, keys[i], Std.parseInt(line[i]));
							case OdsFloat:
								Reflect.setField(obj, keys[i], Std.parseFloat(line[i]));
							case OdsString:
								Reflect.setField(obj, keys[i], line[i]);
							case OdsNull:
								Reflect.setField(obj, keys[i], null);
						}
					}
				}
			}
		}
		return sheets;
	}
}
