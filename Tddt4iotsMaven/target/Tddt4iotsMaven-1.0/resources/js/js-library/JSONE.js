/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Erweiterte JSON, die auch spezielle Objekte parst und zu JSON umwandelt:
//Objekte, die sich selbst enthalten
//Objekte, die Funktionen enthalten
var JSONE = {};
JSONE.to = {};
JSONE.to.removeCycle = function(obj,already = [],lvl = 1,path="PATH#obj"){
	if(typeof obj === "object")
	{
		for(var i in already)
		{
			if(already[i].obj===obj && (already[i].lvl<lvl-1||already[i].lvl==0))
			{
				return already[i].loc;
			}
		}
		
		if(lvl===1)
		{
			already.push({obj:obj,loc:path,lvl:0});
		}
		for(var i in obj)
		{
			already.push({obj:obj[i],loc:path + "." + i,lvl:lvl});
		}
		for(var i in obj)
		{
			obj[i] = JSONE.to.removeCycle(obj[i],already,lvl+1,path + "." + i);
		}
	}
	return obj;
}
JSONE.to.changeFuncs = function(obj)
{
	if(typeof obj === "function")
	{
		return "FUNCTION#" + obj.toString();
	}
	else if(typeof obj === "object")
	{
		var cl = clone(obj);
		for(var i in cl)
		{
			cl[i] = JSONE.to.changeFuncs(cl[i]);
		}
		return cl;
	}
	return obj;
}
JSONE.stringify = function(obj)
{
	if(typeof obj === "object")
	{
		for(var i in JSONE.to)
		{
			obj = JSONE.to[i](obj);
		}
	}
	return JSON.stringify(obj);
}
JSONE.from = {};
JSONE.from.addFuncs = function(obj)
{
	if(typeof obj === "string" && obj.substr(0,9)==="FUNCTION#")
	{
		var ret;
		try
		{
			eval("ret = " + obj.substr(9));
			return ret;
		}
		catch(e)
		{
			return obj;
		}
	}
	else if(typeof obj === "object")
	{
		for(var i in obj)
		{
			obj[i] = JSONE.from.addFuncs(obj[i]);
		}
		return obj;
	}
	return obj;
}
JSONE.from.addCycle = function(obj,paths = [],already = [],path="PATH#obj")
{
	for(var i in already)
	{
		if(already[i]===obj)
		{
			return obj;
		}
	}
	for(var i in paths)
	{
		if(paths[i].path===obj)
		{
			obj = paths[i].obj;
		}
	}
	for(var i in already)
	{
		if(already[i]===obj)
		{
			return obj;
		}
	}
	paths.push({path:path,obj:obj});
	already.push(obj);
	
	for(var i in obj)
	{
		obj[i] = JSONE.from.addCycle(obj[i],paths,already,path + "." + i);
	}
	return obj;
}
JSONE.parse = function(txt)
{
	var obj = JSON.parse(txt);
	if(typeof obj === "object")
	{
		for(var i in JSONE.from)
		{
			obj = JSONE.from[i](obj);
		}
	}
	return obj;
}

//Funktion, die auch Objekte klont, die sich selbst enthalten
function clone(obj,already = [])
{
	if(typeof obj === "object")
	{
		for(var i in already)
		{
			if(already[i].obj === obj)
			{
				return already[i].cl;
			}
		}
	
		var cl = {};
		already.push({obj:obj,cl:cl});
		for(var i in obj)
		{
			cl[i] = clone(obj[i],already);
		}
		return cl;
	}
	return obj;
}


