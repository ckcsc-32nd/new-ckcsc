
///// nameCard.js /////
(function($){
	// var log = console.log;
	var log = () => {};
	
	log('nameCard loaded');		
	$.fn.nameCard = function(data){
		var ctx = this[0].getContext('2d');
		if(!data) data = {};
		var preData = {
			name: '吳政儒',
			nickName: '狸貓',
			job: '社長 社寵'
		};
		for(var i in preData){
			if(!(i in data)){
				data[i] = preData[i];
			}
		}
	
		ctx.fillStyle = '#1b2124';
		ctx.fillRect(0,0,900,540);
		ctx.fillStyle = '#ffffff';
		ctx.font = '120px Auraka';
		ctx.fillText(data.name,30,130);
		ctx.font = '60px Auraka';
		ctx.fillText(data.job,420,80);
		ctx.font = '50px Auraka';
		ctx.fillText(data.nickName,420,150)
		
		ctx.font = '30px Auraka';
	}
})(jQuery);
///// avatar.js /////
(function($){
	// var log = console.log;
	var log = () => {};
	
	log('avatar loaded');
	function black(x, y, ctx){
		var size = 16;
		var rawX = x * size;
		var rawY = 128 - size * (y + 1);
		// console.table({x: rawX, y: rawY});
		ctx.fillRect(rawX, rawY, size, size);
	}
			
	function clear(ctx, bgColor){
		var tmp = ctx.fillStyle;
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, 128, 128);
		ctx.fillStyle = tmp;
	}

	function generate(ctx, color, bgColor){
		clear(ctx, bgColor);
		var tmp = ctx.fillStyle;
		ctx.fillStyle = color;

		var list = [7,6,5,4];
		for(var i = 0; i < 8; i++){
			for(var j in list){
				if(Math.random() * 100 > 50){
					black(j, i, ctx);
					black(list[j], i, ctx);
				}
			}
		}

		ctx.fillStyle = tmp;
	}

	$.fn.avatar = function(color = '#ffffff', bgColor = '#000000'){
		// console.table({color: color, bgColor: bgColor});
		var ctx = this[0].getContext('2d');
		generate(ctx, color, bgColor);
		
		return this;
	}
})(jQuery);

///// script.js /////
var nameCard = function($){
	// var log = console.log;
	var log = () => {};
	
	log('script loaded');
	var intro = [];
	var index = 0;
	var all = 16;
	var step = 2;
	var data;
	
	
	$(document).ready(function(){
		$.getJSON('/api/GET/user')
			.done((e) => {
				data = e;
				data.forEach((item, index) => {
					$.ajax(`./intro/${item.intro}`).
						then((data) => {
							intro[index] = data;
						}).
						catch(() => {
							intro[index] = 'not found';
						});
				});
				if($('#nameCard-lg')[0])nameCard(1);
				$('#p0').text(data[0].name).click(()=>{button(0)});
				$('#p1').text(data[1].name).click(()=>{button(1)});
				$('#p2').text(data[2].name).click(()=>{button(2)});
				$('#p3').text(data[3].name).click(()=>{button(3)});
			})
		
	
		$('#avatar').hide();
	
		$('#left').click(()=>{left(all - step)});
		$('#right').click(()=>{left(step)});
	
	});
	
	function nameCard(index){
		
		if(intro.length <= 3){
			setTimeout(nameCard, 100, index);
			return;
		}
	
		index -= 1;
		var person = data[index];
		var card = $('#nameCard-lg');
		var ctx = card[0].getContext('2d');
	
		log(index);
		card.nameCard({
		//console.table({
			name: person.name,
			nickName: person.nickName,
			job: (function(job){
				var r = '';
				for(var i in job){
					r += job[i] + ' ';
				}
				return r;
			})(person.position)
		});
		
		$('#avatar').avatar();
		ctx.drawImage($('#avatar')[0], 50.5, 200.5, 256,256);
	
		log(person);
		
		var spot = [230, 280, 330, 380, 430, 480];
		var text = intro[index].split('\n');
		log(text);
		for(var i in text){
			ctx.fillText(text[i], 330, spot[i]);
		}		
	
		var canvasSize = [
			[450,270],
			[600,360],
			[1200,720]
		];
	
		$('canvas').not('#avatar').not('#nameCard-lg').each((index, item)=>{
			var ctx = item.getContext('2d');
			ctx.drawImage(card[0], 0, 0, canvasSize[index][0], canvasSize[index][1]);
		})
	
	}
	
	function left(n){
		index = (index + n) % all;
		log('===== left =====');
		for(var i = 0; i < 4; i++){
			log(j)
			var j = (index + i) % all;
			$(`#p${i}`).text(data[j].name);
		}
		log('================');
	}
	
	function button(n){
		var i = (index + n) % all;
		nameCard(i + 1);
	}
	
	$(window).resize(()=>{
		var nameCard = $('canvas').not('#avatar');
		var w = $(this).width();
		log(w);
		nameCard.hide();
		if(w >= 1400){
			nameCard.eq(3).show();
		}else if(w >=992){
			nameCard.eq(2).show();
		}else if(w >=768){
			nameCard.eq(1).show();
		}else{
			nameCard.eq(0).show();
		}
	}).resize();
};
