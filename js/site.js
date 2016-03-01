function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function sparkLine(id,data){

	var width = 100;
	var height = 25;
	var x = d3.scale.linear().range([0, width-4]);
	var y = d3.scale.linear().range([height-4, 0]);
	var line = d3.svg.line()
             .x(function(d,i) { return x(i); })
             .y(function(d) { return y(d); })
             .interpolate("basis");	
	x.domain([0,data.length-1]);
  	y.domain(d3.extent(data, function(d) { return d; }));

  	d3.select(id)
	    .append('svg')
	    .attr('width', width)
	    .attr('height', height)
	    .append("g")
	    .attr("transform", "translate(2,2)")
	    .append('path')
	    .datum(data)
	    .attr('class', 'sparkline')
	    .attr('d', line)
	    .attr('stroke','#B71C1C')
	    .attr('stroke-width',3);
}

var format = d3.format("0,000");

$.ajax({
		type:'GET',
		url: 'https://proxy.hxlstandard.org/data.json?filter01=select&select-query01-01=%23severity%3DSuspected&count-tags02=%23date%2BEPIweek%2Boutbreak&filter03=count&url=https%3A//docs.google.com/spreadsheets/d/1_S6PA5L32Mq7H_cfp9NAe-Y8-17hNer2OMyb3hVPTvU/pub%3Fgid%3D1516521608%26single%3Dtrue%26output%3Dcsv&count-tags03=%23date%2BEPIweek%2Boutbreak&select-query02-01=%23affected%21%3D0&filter02=select&strip-headers=on', 
    	dataType: 'json',		
      	success: function(data) {
      		data = hxlProxyToJSON(data);
      		data.forEach(function(d){
      			d['#date+epiweek+outbreak'] = +d['#date+epiweek+outbreak']
      		});
			data.sort(function(a, b){
				return a['#date+epiweek+outbreak'] - b['#date+epiweek+outbreak'];
			});
      		$('#affectedcountries').html(data[data.length-1]['#meta+count']);
      		var sparkData = [];
      		data.forEach(function(d){
      			sparkData.push(d['#meta+count']);
      		});
      		sparkLine('#countriesspark',sparkData);
      	}
    });

$.ajax({
		type:'GET',
		url: 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1_S6PA5L32Mq7H_cfp9NAe-Y8-17hNer2OMyb3hVPTvU/pub%3Fgid%3D1516521608%26single%3Dtrue%26output%3Dcsv&filter01=count&count-tags01=date%2BEPIweek%2Boutbreak%2Cseverity&count-aggregate-tag01=%23affected&strip-headers=on', 
    	dataType: 'json',		
      	success: function(data) {
      		data = hxlProxyToJSON(data);
      		data.forEach(function(d){
      			d['#date+epiweek+outbreak'] = +d['#date+epiweek+outbreak']
      		});
      		var maxWeek = d3.max(data,function(d){
      			return d['#date+epiweek+outbreak'];
      		})
      		deaths = [];
      		suspecteds = [];
      		confirmeds = [];
      		data.forEach(function(d){
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Confirmed'){
      				$('#confirmed').html(format(d['#meta+sum']));
      			}
      			if(d['#severity']=='Confirmed'){confirmeds.push(d['#meta+sum'])};
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Suspected'){
      				$('#suspected').html(format(d['#meta+sum']));
      			}
      			if(d['#severity']=='Suspected'){suspecteds.push(d['#meta+sum'])};
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Deaths'){
      				$('#deaths').html(format(d['#meta+sum']));
      			}
      			if(d['#severity']=='Deaths'){deaths.push(d['#meta+sum'])};
      		});
      		sparkLine('#deathsspark',deaths);
      		sparkLine('#suspectedspark',suspecteds);
      		sparkLine('#confirmedspark',confirmeds);      		
     	}
    });
