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

var format = d3.format("0,000");

$.ajax({
		type:'GET',
		url: 'https://proxy.hxlstandard.org/data.json?filter01=select&select-query01-01=%23severity%3DSuspected&count-tags02=%23date%2BEPIweek%2Boutbreak&filter03=count&url=https%3A//docs.google.com/spreadsheets/d/1_S6PA5L32Mq7H_cfp9NAe-Y8-17hNer2OMyb3hVPTvU/pub%3Fgid%3D1516521608%26single%3Dtrue%26output%3Dcsv&force=on&count-tags03=%23date%2BEPIweek%2Boutbreak&select-query02-01=%23affected%21%3D0&filter02=select&strip-headers=on', 
    	dataType: 'json',		
      	success: function(data) {
      		data = hxlProxyToJSON(data);
      		data.forEach(function(d){
      			d['#date+epiweek+outbreak'] = +d['#date+epiweek+outbreak']
      		});
      		var maxWeek = d3.max(data,function(d){
      			return d['#date+epiweek+outbreak'];
      		})
      		data.forEach(function(d){
      			if(d['#date+epiweek+outbreak']==maxWeek){
      				$('#affectedcountries').html(d['#meta+count']);
      			}
      		})
     	}
    });

$.ajax({
		type:'GET',
		url: 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1_S6PA5L32Mq7H_cfp9NAe-Y8-17hNer2OMyb3hVPTvU/pub%3Fgid%3D1516521608%26single%3Dtrue%26output%3Dcsv&filter01=count&count-tags01=date%2BEPIweek%2Boutbreak%2Cseverity&count-aggregate-tag01=%23affected&force=on&strip-headers=on', 
    	dataType: 'json',		
      	success: function(data) {
      		data = hxlProxyToJSON(data);
      		data.forEach(function(d){
      			d['#date+epiweek+outbreak'] = +d['#date+epiweek+outbreak']
      		});
      		var maxWeek = d3.max(data,function(d){
      			return d['#date+epiweek+outbreak'];
      		})
      		data.forEach(function(d){
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Confirmed'){
      				$('#confirmed').html(format(d['#meta+sum']));
      			}
      		});
      		data.forEach(function(d){
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Suspected'){
      				$('#suspected').html(format(d['#meta+sum']));
      			}
      		});
      		data.forEach(function(d){
      			if(d['#date+epiweek+outbreak']==maxWeek && d['#severity']=='Deaths'){
      				$('#deaths').html(format(d['#meta+sum']));
      			}
      		});      		
     	}
    });
