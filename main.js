;(function() {
	
	var G = 9.81; // Ускорение свободного падения
	var DELAY = 20; // ms
	var SIZE = 20;

	function getRandom()
	{
		return Math.random();
		//return 0.5;
	}
	function randomDirection()
	{
		return { x: getRandom() > 0.5 ? 1 : -1, y: getRandom() < 0.5 ?  1 : - 1 };
	}

	function circleClass(id){
		// ид, вес, скорость
		this.id = id;
		this.weight = getRandom() + 1;
		this.speed = getRandom() + 1;
		this.vacuum = false;
		this.dragondrop = false;
		
		this.vector = randomDirection();

		this.gravityRun = function()
		{
			//Гравитация

			var circle = document.getElementById(this.id);
			var sizeParent = circle.parentNode.offsetHeight;
			var circleY = circle.offsetTop
			
			if(sizeParent - SIZE < circleY)
				return;

			circle.style.top  = circleY + G * this.weight + 'px';
			
			if(sizeParent - SIZE < circle.offsetTop)
				circle.style.top = (sizeParent - SIZE + 3) + 'px';

			return;

		}

		this.vacuumRun = function(startX, startY, endX, endY)
		{
			var circle = document.getElementById(this.id);
			var circleY = circle.offsetTop;
			var circleX = circle.offsetLeft;


			if(circleX < startX)
			{
				circleX = startX + 2;
				this.vector.x *= -1;
			}

			if(circleX > endX - SIZE)
			{
				circleX = endX - SIZE - 2;
				this.vector.x *= -1;
			}

			if(circleY < startY)
			{
				circleY = startY + 2;
				this.vector.y *= -1; 
			}

			if(circleY > endY - SIZE)
			{
				circleY = endY - SIZE - 2;
				this.vector.y *= -1;
			}

			circle.style.left = circleX + this.speed * this.weight * this.vector.x  + 'px';
			circle.style.top = circleY + this.speed * this.weight * this.vector.y  + 'px';

		}

	};

	var obj_arr = {};

	var dragObject = null;
	var zona1 = document.getElementById('zona1');
	var zona2 = document.getElementById('zona2');

	var onup_zona1 = function(e){
		// Создание шариков 

		if(e.target.className === 'circle')
			return;	

	
		if(e.pageY > this.clientHeight - SIZE)
			return;


		var zona1 = document.getElementById('zona1');
		var circle = document.createElement('div');
		circle.id = 'circle_' + Object.keys(obj_arr).length;
		circle.className = 'circle';
		circle.style.top = e.pageY - SIZE/2 + 'px';
		circle.style.left = e.pageX - SIZE/2 + 'px';

	
		zona1.appendChild(circle);
		
		obj_arr[circle.id] = new circleClass(circle.id); 

	};

	// DragOnDrop
	var mouseUp = function(e)
	{
		document.onmousemove = null;
        document.onmouseup = null;

        document.ondragstart = null;
        document.body.onselectstart = null;

        zona2.className = 'zona2';

        obj_arr[e.target.id].dragondrop = false;
        

        if(e.pageX > zona2.offsetLeft)
        {	
       		dragObject.parentNode.removeChild(dragObject);
       		zona2.appendChild(dragObject);
       		obj_arr[e.target.id].vacuum = true;
       	}

        dragObject = null;

        document.body.style.cursor = 'default';


        // console.log('Up!');

	}

	var mouseMove = function(e)
	{

		dragObject.style.top = e.pageY - SIZE/2 + 'px';
		dragObject.style.left = e.pageX - SIZE/2 + 'px';
		if(e.pageX > zona2.offsetLeft)
			zona2.className = 'zona2-select';
	
		else if(zona2.className === 'zona2-select')
			zona2.className = 'zona2';
	}

	var mouseDown = function(e)
	{
		
		if(!(e.target.className === 'circle') || e.pageX > zona2.offsetLeft)
			return;


		dragObject = document.getElementById(e.target.id);
		obj_arr[e.target.id].dragondrop = true;
		//console.log(e.target.id);
		
		document.onmouseup = mouseUp;
		document.onmousemove = mouseMove;

		// console.log('Down!');
		//console.log(e);
		document.body.style.cursor = 'move';

		document.ondragstart = function() { return false };
		document.body.onselectstart = function() { return false };


	}

	document.onmousedown = mouseDown;

	zona1.onmouseup = onup_zona1;

	var ActionCircle = function()
	{
		for(var item in obj_arr)
		{
			
			if(obj_arr[item].dragondrop)
				continue;

			if(obj_arr[item].vacuum)
				obj_arr[item].vacuumRun(zona2.offsetLeft, 0, zona2.offsetWidth + zona2.offsetLeft, zona2.offsetHeight);
			else
				obj_arr[item].gravityRun();
		}

	};

	setInterval(ActionCircle, DELAY);

})();
