function Settings()
{
	this.values =
	{
		global:
		{
			fps: 30,
			canvas_width: 800,
			canvas_height: 600,
		},		
		grid:
		{
			gridNode:
			{
				color: '#D3D7D8',
				active_color: '#B1B4B4', 
				radius: 5.0,
			},
			gridLine:
			{
				color: '#D3D7D8',
			},
			gridPiece:
			{
				color1: '#0033CC',
				color2: '#FF0000',
				radius: 10.0,
			},
			gridThread:
			{
				color1: '#0033CC',
				color2: '#FF0000',				
			},
		},
	};
}

//expose module API
exports.instance = Settings;
