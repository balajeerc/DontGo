/*
   Function: drawCurveThrough
   Multiplies two integers.

   Parameters:
      ctx - An active canvas context to draw on
      knots - An array of 2d arrays representing the points
      		  through which the curve must pass	
*/
function drawCurveThrough(ctx,knots){
	if (!knots instanceof Array)
		throw "Second argument to drawCurveThrough must be an array";
	var n = knots.length-1;
	if (n < 1)
		throw "At least two knot points required to draw curve through";
		
	//Define two arrays representing the first and second control points
	//for each bezier segment
	var firstControlPoints = new Array();
	var secondControlPoints = new Array();	
	if (n == 1)
	{ 
		// Special case: Bezier curve should be a straight line.
		firstControlPoints.push(new Array(2))
		// 3P1 = 2P0 + P3
		firstControlPoints[0][0] = (2 * knots[0][0] + knots[1][0]) / 3;
		firstControlPoints[0][1] = (2 * knots[0][1] + knots[1][1]) / 3;

		secondControlPoints.push(new Array(2))
		// P2 = 2P1 – P0
		secondControlPoints[0][0] = 2*firstControlPoints[0][0] - knots[0][0];
		secondControlPoints[0].Y = 2*firstControlPoints[0][1] - knots[0][1];
		return;
	}

	// Calculate first Bezier control points
	// Right hand side vector
	var rhs = new Array[n];

	// // Set right hand side X values
	// for (var i=1; i<n-1; ++i)
		// rhs[i] = 4 * knots[i][0] + 2 * knots[i+1][0];
	// rhs[0] = knots[0][0] + 2*knots[1][0];
	// rhs[n-1] = (8*knots[n-1][0]+knots[n][0])/2.0;
// 		
	// // Get first control points X-values
	// var x = GetFirstControlPoints(rhs);
// 
	// // Set right hand side Y values
	// for (var i=1; i<n-1; ++i)
		// rhs[i] = 4*knots[i][1] + 2*knots[i+1][1];
	// rhs[0] = knots[0][1] + 2*knots[1][1];
	// rhs[n-1] = (8*knots[n-1][1] + knots[n][1])/2.0;
// 		
	// // Get first control points Y-values
	// var y = GetFirstControlPoints(rhs);
// 
	// // Fill output arrays.
	// firstControlPoints = new Point[n];
	// secondControlPoints = new Point[n];
	// for (int i = 0; i < n; ++i)
	// {
		// // First control point
		// firstControlPoints[i] = new Point(x[i], y[i]);
		// // Second control point
		// if (i < n - 1)
			// secondControlPoints[i] = new Point(2 * knots
				// [i + 1].X - x[i + 1], 2 *
				// knots[i + 1].Y - y[i + 1]);
		// else
			// secondControlPoints[i] = new Point((knots
				// [n].X + x[n - 1]) / 2,
				// (knots[n].Y + y[n - 1]) / 2);
	// }
}

/*
   Function: getColorStyle
   Given a color array, i.e. a vector of four floats, 
   returns a string that can be used to set a canvas style

   Parameters:
      color - array of 3 or 4 floats representing RGB or RGBA values
      
   Returns:
	  a canvas style string representing the specified color	   	  	   
*/
function getColorStyle(color)
{
	if(!color instanceof Array || color.length!=4)
		throw "ThError: Color must be an array of 4 floats!"
	
	stylestr = "rgba(";
	for(var i=0;i<4;i++)
	{
		stylestr += color[i].toString();
		if(i<3)
			stylestr += ",";	
	}
	stylestr += ")";
	
	return stylestr;
}

//expose module API
exports.drawCurveThrough = drawCurveThrough;
exports.getColorStyle = getColorStyle;
