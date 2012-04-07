/*
 	Function: GetParameterByName
 	Parses the current url to return a parameter from it
 	
 	Parameters:
 	name - parameter name
 */
function GetParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

//expose module API
exports.getUrlParam = GetParameterByName;
