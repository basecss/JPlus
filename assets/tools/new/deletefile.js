Console.Write("输入模块名(如form/textbox):  ");
var root = "";
var saveRoot = root + "../";
var moduleName = Console.ReadLine().toLowerCase();

var mainModuleName = moduleName.split('/')[0];
var subModuleName = moduleName.split('/')[1];

if(!subModuleName) {
	Console.Write('缺少子模块');
	return;
}

var text = System.IO.File.ReadAllText(root + "tpl/index.html");
text = text.replace("\"assets/styles/index", "\"assets/styles/" + subModuleName).replace("\"assets/scripts/index", "\"assets/scripts/" + subModuleName);

System.IO.File.Delete(saveRoot + moduleName + ".html", text);

var path = saveRoot + mainModuleName + "/assets/styles/" + subModuleName + ".css";

if(System.IO.File.Exists(path)) {
	System.IO.File.Delete(path);
}


path = saveRoot + mainModuleName + "/assets/styles/" + subModuleName + ".less";

if(System.IO.File.Exists(path)) {
	System.IO.File.Delete(path);
}


path = saveRoot + mainModuleName + "/assets/scripts/" + subModuleName + ".js";

if(System.IO.File.Exists(path)) {
	System.IO.File.Delete(path);
}

Console.Write("完成");