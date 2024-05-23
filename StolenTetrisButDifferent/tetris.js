try{
	
	/*
		make pieces fall faster after each 500 points by 10%
		make board scale to window resoultion
	*/
	
	//pieceTables
	//x,y,x,y,x,y,x,y,color,id
	let pieceTabler0 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,-1,1,0,-1,0,2,1],
		[0,0,0,1,0,2,0,-1,0,2],
		[0,0,1,0,-1,0,-1,1,5,3],
		[0,0,1,0,-1,0,1,1,6,4],
		[0,0,-1,0,1,1,0,1,3,5],
		[0,0,1,0,-1,1,0,1,4,6]
	];
	let pieceTabler1 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,1,0,0,-1,2,1],
		[0,0,1,0,2,0,-1,0,0,2],
		[0,0,0,1,0,-1,-1,-1,5,3],
		[0,0,0,1,0,-1,1,-1,6,4],
		[0,0,0,1,1,-1,1,0,3,5],
		[0,0,0,-1,1,1,1,0,4,6]
	];
	let pieceTabler2 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,1,0,-1,0,2,1],
		[0,0,0,1,0,2,0,-1,0,2],
		[0,0,1,0,-1,0,1,-1,5,3],
		[0,0,1,0,-1,0,-1,-1,6,4],
		[0,0,-1,0,1,1,0,1,3,5],
		[0,0,1,0,-1,1,0,1,4,6]
	];
	let pieceTabler3 = [
		[0,0,0,1,1,0,1,1,1,0],
		[0,0,0,1,0,-1,-1,0,2,1],
		[0,0,1,0,2,0,-1,0,0,2],
		[0,0,0,1,0,-1,1,1,5,3],
		[0,0,0,1,0,-1,-1,1,6,4],
		[0,0,0,1,1,-1,1,0,3,5],
		[0,0,0,-1,1,1,1,0,4,6]
	];
	
	let lineChecked = false; 
	let linesCleared = 0;
	let board = document.getElementById("board");
	let ctx = board.getContext("2d");
	let box = 32;
	let width = 10;
	let height = 20;
	let active = true;
	let colors = ["#00FFFF", "#FFFF00", "#800080", "#00FF00", "#FF0000", "#0000FF", "#FF7F00", "#808080", "#F0F0F0"];
	
	let score = 0;
	let scoreDiv = document.getElementById("score");
	
	//random gen list
	let list = [0,1,2,3,4,5,6];
	
	//nextpiece
	let nextCanvas = document.getElementById("next");
	let nextCtx = nextCanvas.getContext("2d");
	let nextId = nextRand();
	let next = pieceTabler0[nextId];
	//69
	//held piece
	let heldCanvas = document.getElementById("held");
	let heldCtx = heldCanvas.getContext("2d");
	let held = 0;
	
	//piece things
	let piece = pieceTabler0[nextRand()];
	let piecex = 4;
	let piecey = 4;
	let pieceRot = 0;
	let swap = false;
	
	let lineClear = false;
	
	//init board
	
	board.width = box * width;
	board.height = box * height;
	
	nextCanvas.width = box * 4;
	nextCanvas.height = box * 4;
	
	heldCanvas.width = box * 4;
	heldCanvas.height = box * 4;
	
	let grid = Array(width);
	for(let x = 0; x < width; x++){
		grid[x] = Array(height);
		for(let y = 0; y < height; y++){
			grid[x][y] = 7;
		}
	}
	
	addEventListener("load", (event) => {
		if(document.cookie == ""){
			document.cookie = 0;
		}
	});

	//draw things
	draw();
	function draw(){
		ctx.clearRect(0,0,board.width,board.height);
		for(let y = 0; y < height; y++){
			for(let x = 0; x < width; x++){
				ctx.fillStyle = colors[grid[x][y]];
				ctx.fillRect(x*box,y*box,box,box);
			}
		}
		ctx.fillStyle = colors[piece[8]];
		for(let i = 0; i < 8; i+=2){
			ctx.fillRect((piece[i]+piecex)*box,(piece[i+1]+piecey)*box,box,box);
		}
		ctx.fillStyle = colors[piece[8]] + "40";
		for(let y = 0; y < height; y++){
			if(collide(false, y)){
				for(let i = 0; i < 8; i+=2){
					ctx.fillRect((piece[i]+piecex)*box,(piece[i+1]+piecey+y)*box,box,box);
				}
				break;
			}
		}
		nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
		nextCtx.fillStyle = colors[7];
		nextCtx.fillRect(0,0,box*4,box*4);
		nextCtx.fillStyle = colors[next[8]];
		for(let i = 0; i < 8; i+=2){
			nextCtx.fillRect((next[i]+1)*box,(next[i+1]+1)*box,box,box);
		}
			
		heldCtx.clearRect(0,0,heldCanvas.width,heldCanvas.height);
		heldCtx.fillStyle = colors[7];
		heldCtx.fillRect(0,0,box*4,box*4);
		heldCtx.fillStyle = colors[swap ? 8 : held[8]];
		for(let i = 0; i < 8; i+=2){
			heldCtx.fillRect((held[i]+1)*box,(held[i+1]+1)*box,box,box);
		}
    
		let highScore = parseInt(document.cookie);
		if(highScore < score){
			document.cookie = score;
		}

		document.getElementById("highScore").innerHTML = "high score: " + lineChecked;
	}
	
	//loop every 1/2 second

	let intervalId = window.setInterval(function(){
	if(active && !lineClear){
		if(!collide(true,0)){piecey++;}
			rowCheck();
			draw();
			scoreDiv.innerHTML = "score: "+score;
			for(let x = 0; x < width; x++){
				for(let y = 0; y < height; y++){
					if(grid[x][y] != 7){

					}
				}
			}
		}
	}, 500);
	
	//keyboard input
	
	window.addEventListener("keydown", function (event) {
		try{
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		if(!lineClear){
        	let didCollide = false;
			switch (event.key) {
				case "ArrowDown":
				case "s":
					for(let i = 0; i < 8; i+=2){
						if(grid[piece[i]+piecex][piece[i+1]+piecey+1] != 7){
							didCollide = true;
							break;
						}
						if(piece[i+1]+piecey >= height){
							didCollide = true
							break;
						}
					}
					if(!didCollide){piecey++;}
					break;
				case "q":
					pieceRot++;
					if(pieceRot == 4){
						pieceRot = 0;
					}
					applyRotation();
					for(let i = 0; i < 8; i+=2){
						if(grid[piece[i]+piecex][piece[i + 1]+piecey] != 7){
							pieceRot--;
							if(pieceRot == -1){
								pieceRot = 3;
							}
							applyRotation();
							break;
						}
						if(piece[i] < 0 || piece[i] >= width){
							pieceRot--;
							if(pieceRot == -1){
								pieceRot = 3;
							}
							applyRotation();
							break;
						}
					}
					break;
				case "ArrowUp":
				case "Shift":
				case "e":
					pieceRot--;
					if(pieceRot == -1){
						pieceRot = 3;
					}
					applyRotation();
					break;
				case "ArrowLeft":
				case "a":
					for(let i = 0; i < 8; i+=2){
						if(grid[piece[i]+piecex-1][piece[i + 1]+piecey] != 7){
							didCollide = true;
							break;
						}
						if(piece[i] + piecex <= 0){
							didCollide = true
							break;
						}
					}
					if(!didCollide){piecex--;}
					break;
				case "ArrowRight":
				case "d":
					for(let i = 0; i < 8; i+=2){
						if(grid[piece[i]+piecex+1][piece[i+1]+piecey] != 7){
							didCollide = true;
							break;
						}
						if(piece[i]+piecex >= width){
							didCollide = true
							break;
						}
					}
					if(!didCollide){piecex++;}
					break;
				case "/":
					for(let y = 0; y < height; y++){
						if(collide(true, y)){
							rowCheck();
							break;
						}
					}
					break;
				case "Backspace":
					active = false;;
					break;
				case "Enter":
					active = true;
					break;
				case "Alt":
				case "r":
					if(!swap){
						let temp = held;
						held = piece;
						piece = temp;
						if(piece == 0){
							piece = next;
							nextId = nextRand();
							next = pieceTabler0[nextId];
					}
					applyRotation();
					swap = true;
				}
				break;
				default:
				return; // Quit when this doesnt handle the key event.
			}
			collide(true,0);
			draw();
			// Cancel the default action to avoid it being handled twice
		}
		event.preventDefault();
	}catch(e){
		//this.alert(e + ", " + e.stack);
	}
	}, true);
	
	//check collisions

	function collide(lineBreak, yOffset){
		let didCollide = false;
		for(let i = 0; i < 8; i+=2){
			if(grid[piece[i]+piecex][piece[i+1]+piecey+1+yOffset] != 7){
				didCollide = true;
				break;
			}
			if(piece[i+1]+piecey >= height){
				didCollide = true;
				break;
			}
		}
		if(lineBreak){
			if(didCollide){
				for(let i = 0; i < 8; i+=2){
					grid[piece[i]+piecex][piece[i+1]+piecey+yOffset] = piece[8];
				}
				piecex = 4;
				piecey = 1;
				piecerot = 0;
				piece = pieceTabler0[nextId];
				nextId = nextRand();
				next = pieceTabler0[nextId];
				applyRotation();
				swap = false;
			}
		}
		return didCollide;
	}
	
	//apply rotation
	
	function applyRotation(){
		switch(pieceRot){
			case 0:
				piece = pieceTabler0[piece[9]];
				break;
			case 1:
				piece = pieceTabler1[piece[9]];
				break;
			case 2:
				piece = pieceTabler2[piece[9]];
				break;
			case 3:
				piece = pieceTabler3[piece[9]];
				break;
		}
	}
	
	//check for rows
	
	function rowCheck(){
		
		if(lineChecked){
			linesCleared = 0;
		}
		let b = false;
		let changed = true;
		for(let y = 0; y < height; y++){
			let filled = 0;
			for(let x = 0; x < width; x++){
				if(grid[x][y] != 7){
					filled++;
				}else{
					break;
				}
			}
			if(filled == width){
				lineChecked = false;
				b = true;
			}
		}
		if(b){
			lineClear = true;
			let a = false;
			let id = window.setInterval(function(){
				changed = false;
				for(let y = 0; y < height; y++){
					let filled = 0;
					for(let x = 0; x < width; x++){
						if(grid[x][y] != 7){
							filled++;
						}else{
							break;
						}
					}
					if(filled == width){
						for(let my = y; my > 0; my--){
							for(let mx = 0; mx < width; mx++){
								grid[mx][my] = grid[mx][my-1];
								grid[mx][my-1] = 7;
							}
						}
						a = true;
						linesCleared+=1;
						changed = true;
					}
				}
				if(!lineChecked){
					if (linesCleared == 1){score+=100;}
				else if (linesCleared == 2){score+=200;}
				else if (linesCleared == 3){score+=600;}
				else if (linesCleared >  3)(score+=2400);
				}
				if(a){
					
					for(let x = 0; x < width; x++){
						for(let y = height; y > 1; y--){
							if(grid[x][y] == 7 && grid[x][y-1] != 7){
								grid[x][y] = grid[x][y-1];
								grid[x][y-1] = 7;
								changed = true;
							}
						}
					}
				}
				draw();
				if(!changed){
					lineClear = false;
					window.clearInterval(id);
					return;
				}
			}, 250);
		}
	}

	//random number for piece generation

	function nextRand(){
		a = Math.floor(Math.random() * list.length);
		g = list[a];
		for(let i = a; i < list.length - 1; i++){
			list[i] = list[i + 1];
		}
		list.length = list.length - 1;
		if(list.length == 0){
			list = [0,1,2,3,4,5,6];
		}
		return g;
	}
}catch(error){
	alert(":(  " + error);
}
//420