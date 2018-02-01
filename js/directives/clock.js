app.controller("clockController",
	function($scope, $http, $interval) {

		$scope.utc =
		  {tz: 'UTC',
		  time: '',
		  offset: 0};


		$http.get('/api/time')
			 .then(function (res) {
				$scope.utc.time =res;
			 })
			 .catch(function (res) {
			 	console.log("err retrieving utc time from node server");
			 	$scope.utc.time =0;
			 });

		//destroy timer
		$scope.$on('$destroy', function() {
			 	console.log("interval destroyed by controller");
			 	$interval.cancel($scope.myPromise);
			 })
	});

app.directive('clock', ['$interval', function($interval){


	function link(scope,element) {

		//d3 initial and static donut chart elements here
		var el = element[0];

		var data = scope.data;
		var width = 155;
		var height = 155;
		var min = Math.min(width,height);

		//d3 clock
		//svg is 450x450 somehow make relative to that...
		var r = 75,
		    m = 2.5;
		var w = (r+m)*2,
		    h = (r+m)*2;

		var secondTickStart = r;
		    secondTickLength = -0.033*min;

		var secondScale = d3.scale.linear()
		  .range([0,354])
		  .domain([0,59]);


		  //$scope.timezones[1]
		var fields = [
		  {name: "hours", value: 0, size: 12},
		  {name: "minutes", value: 0, size: 60},
		  {name: "seconds", value: 0, size: 60}
		];

		var arc = d3.svg.arc()
		    .innerRadius(0.25*r)
		    .outerRadius(function(d) {
		        if(d.name == "hours") {return 0.8*r } return r})
		    .startAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; })
		    .endAngle(function(d) { return (d.value / d.size) * 2 * Math.PI; });

		var svg = d3.select(el).append("svg")
		    .attr("width", w)
		    .attr("height", h)

		var dynamics = svg.append("g")
		    .attr("class", "dynamics")
		    .attr("transform", "translate("+(r+m)+"," + (r+m) + ")");

		var statics = svg.append("g")
		    .attr("class","statics")
		    .attr("transform", "translate("+(r+m)+"," + (r+m) + ")");

		//add marks for seconds
		  statics.selectAll('.second-tick')
		    .data(d3.range(0,60)).enter()
		      .append('line')
		      .attr('class', 'second-tick')
		      .attr('id', function(d){return d})
		      .attr('x1',0)
		      .attr('x2',0)
		      .attr('y1',secondTickStart)
		      .attr('y2', secondTickStart + secondTickLength)
		      .style('stroke-width', function(d) {
		          if( d%5==0 ) { return '3.44px'}
		            return '0.86px'
		      })
		      .attr('transform',function(d){
		        return 'rotate(' + secondScale(d) + ')';
		      });

		//tracks # of seconds since clock is initiated
		var secondsElapsed = 0;

		//use proper digest cycle here?
		scope.myPromise = $interval(function() {

		var initialHours = parseInt(scope.data.time.data.substring(0,2))+scope.data.offset;
		var initialMinutes = parseInt(scope.data.time.data.substring(3,5));
		var initialSeconds = parseInt(scope.data.time.data.substring(6,8));

		  fields[0].previous = fields[0].value; fields[0].value = initialHours+(initialMinutes+Math.floor((initialSeconds+secondsElapsed)/60))/60;//continuously moving hour hand rather than snapping
		  fields[1].previous = fields[1].value; fields[1].value = initialMinutes+Math.floor((initialSeconds+secondsElapsed)/60);
		  fields[2].previous = fields[2].value; fields[2].value = (initialSeconds+secondsElapsed)%60;

		  var path = dynamics.selectAll("path")
		      .data(fields.filter(function(d) { return d.value; }), function(d) { return d.name; })
		      .attr("id", function(d){return d.name;});


		  path.enter().append("path")
		    .transition()
		      .ease("elastic")
		      .duration(750)
		      .attrTween("d", arcTween);

		  path.transition()
		      .ease("elastic")
		      .duration(750)
		      .attrTween("d", arcTween);

		  path.exit().transition()
		    .ease("bounce")
		    .duration(750)
		    .attrTween("d", arcTweenEnd);
			dynamics.selectAll('#seconds').style('stroke-width', 0.011*min + 'px');
			dynamics.selectAll('#minutes').style('stroke-width', 0.022*min + 'px');
			dynamics.selectAll('#hours').style('stroke-width', 0.044*min + 'px');
			secondsElapsed++;
			}, 1000);


		function arcTween(b) {
		  var i = d3.interpolate({value: b.previous}, b);
		  return function(t) {
		      return arc(i(t));
		  };
		}

		function arcTweenEnd(b) {
		  if(b.name == 'seconds' && b.value==0) {b.value=60};
		  var i = d3.interpolate({value: b.previous}, b);
		  b.value=0;
		  return function(t) {
		      return arc(i(t));
		  };
		}

	}
	return {
		restrict: 'E',   //when adding new element, 'A' when updating existing
		link: link,
		scope: {data : '='}
	}
}]);
//end of directive
