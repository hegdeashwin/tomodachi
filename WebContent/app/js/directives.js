var dirObject = angular.module("myapp.directives", []);
dirObject.directive("examForm", function() {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			exams: "=?"
		},
	    templateUrl: "app/partials/exam_form.html",
	    controller: ["$scope", "$routeParams", "$filter", "_", "examService", "$window", function($scope, $routeParams,$filter,  _, examService,$window)
	    {	
	    	$scope.getExams = function(){
				$window.location.href = '#/exam';
			}
	    	$scope.examId = $routeParams.exam_id;
	    	if($scope.examId !== undefined)
	    	{
	    		console.log("ififif");
	    		$scope.students=examService.getStudents(function(){
	    			//get students here...
	    		});
	    		$scope.templates=examService.getTemplates(function(){
	    			//get templates here...
	    		});
	    		$scope.editExams=examService.getallExam(function(response){
					//getting the exams here...
	    			$scope.object = _.findWhere(response, {set_exam_id: parseInt($scope.examId)});
	    			console.log($scope.object,"exam");
	    			$scope.selectedStudent = $scope.object.user.userid;
    			    $scope.selectedTemplate = $scope.object.templatesetexam.template_id;
    			    $scope.selectedDate =  new Date($scope.object.start_date + ' ' + $scope.object.start_time);
    			    $scope.selectedTime = new Date($scope.object.start_date + ' ' + $scope.object.start_time);
    			    $scope.selectedDuration = $scope.object.duration;
				});
	    	}
	    	else
	    	{
	    		console.log("elseelseelse");
	    		$scope.students=examService.getStudents(function(){
	    			//get students here...
	    		});
	    		$scope.templates=examService.getTemplates(function(){
	    			//get templates here...
	    		});
	    		$scope.setExam=function(){
	    			console.log("SetExam clicked!");
	    			$scope.exam.start_date = $filter('date')($scope.exam.start_date, "MM/dd/yyyy");
	    			$scope.exam.start_time = $filter('date')($scope.exam.start_time, "HH:mm:ss");
	    			$scope.exam.template_id = parseInt($scope.exam.template_id);
	    			$scope.exam.templatesetexam = _.findWhere($scope.templates, {template_id: $scope.exam.template_id});
	    			$scope.exam.userid = parseInt($scope.exam.userid);
	    			$scope.exam.user = _.findWhere($scope.students, {userid: $scope.exam.userid});
	    			examService.setexam($scope.exam);
	    			console.log($scope.exam);
	    			$scope.exam={};
	    			alert("Succesfully set the exam!");
	    		};
	    	}
	    }],
	    
	    
	    link: ["$scope",  function($scope){
	    	
	    }]
	   };

	});
	
dirObject.directive("getExam", function() {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: "app/partials/exams.html",
		controller: ["$scope", "$routeParams", '_', 'examService', '$window', function($scope, $routeParams, _, examService, $window)
		             {
			$scope.newExam = function(){
				$window.location.href = "#/exam/new";
			}
			$scope.exams=examService.getallExam(function(){
				//getting the exams here...
			});
		             }],
		             link: ["$scope",  function($scope){
		             }]
	};
}); 	
dirObject.directive("examDetails", function(){
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: "app/partials/setexam.html",
		controller:["$scope", "examService", "$routeParams", function($scope, examService, $routeParams)
		            {
			$scope.setexams=examService.getallExamStudent({userid : $routeParams.userid}),function(){
				//getting all exams here according to userid
			};
		            }],
		            link: ["$scope",  function($scope){
		            }]
	};
}).directive("startExam", function(quizFactory, questionService) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'app/partials/startexam.html',
		controller: ["$scope","$window", "questionService", "$routeParams", function($scope,$window,questionService,$routeParams) { 
			$scope.setexam = questionService.getDurations({examid : $routeParams.examid},function(){
				
			});
			$scope.again=function(){
				$window.location.href = 'candidate.html';
			}				
		}],
		link: function(scope, elem, attrs) {
			scope.startTime = false;
			scope.start = function() {
				scope.id = 0;
				scope.score = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
				scope.isOptionSelected=true;
				scope.startTime = true;
				scope.lastQuestion = false;
			};
			scope.getQuestion = function() {
				scope.count = quizFactory.getCount();
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question; 
					scope.options = [q.op1,q.op2,q.op3,q.op4];
					scope.isOptionSelected=true;
					scope.answer = q.answer;
					if(scope.id == scope.count-1){
						scope.lastQuestion = true;
					}
				}
				else {
					scope.quizOver=true;
					scope.startTime = false;
				}
			};
			scope.checkAnswer = function() {
				if(!$('input[name=option]:checked').length) return;
				var ans = $('input[name=option]:checked').val();
				if(ans == scope.options[scope.answer]) {
					scope.score = scope.score + 1;
				}
				else {
					scope.score = scope.score + 0;
				}
				console.log(scope.score);
			};
			scope.nextQuestion = function() 
			{
				scope.id++;
				scope.getQuestion();
			}
			scope.onOptionSelect=function(option)
			{
				scope.isOptionSelected= false;
			}
			
			var interval = setInterval(function() {
			    var timer = $('span').html();
			    timer = timer.split(':');
			    var minutes = parseInt(timer[0], 10);
			    var seconds = parseInt(timer[1], 10);
			    seconds -= 1;
			    if (minutes < 0) return clearInterval(interval);
			    if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
			    if (seconds < 0 && minutes != 0) {
			        minutes -= 1;
			        seconds = 59;
			    }
			    else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
			    $('span').html(minutes + ':' + seconds);
			    
			    if (minutes == 0 && seconds == 0){	
			        clearInterval(interval);
			        scope.id = null;
			        scope.getQuestion();
			    }
			}, 1000);
		}
	}
}).factory('quizFactory', function(questionService, _) {
	var questions=questionService.getQuestions(function(){
		//getting questions...
	});
	return {
		getCount: function() {
			return questions.length;
		},
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else 
			{
				return false;
			}
		},
		getDurations: function(){
			return setexams;
		}
	};
});
dirObject.directive("studentExamInfo", function() {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			showStart: "=?",
			filterVal: "=?"
		},
		templateUrl: "app/partials/studentinfo.html",
		controller: ["$scope","candidateInfoService","$routeParams", function($scope, candidateInfoService, $routeParams){
			$scope.$watch("filterVal", function(){
				console.log($scope.id);
				if($scope.filterVal === 'all'){
					candidateInfoService.getCandidateInfo({id : $routeParams.id}).$promise.then(function(data){
						console.log(data);
						$scope.candidateInfo = data;
					});
				} else{
					candidateInfoService.getCandidateInfo({id : $routeParams.id, filter: 'remaining'}).$promise.then(function(data){
						console.log(data);
						$scope.candidateInfo = data;
					});
					candidateInfoService.getCandidateInfoNotConducted({id : $routeParams.id, filter: 'remaining'}).$promise.then(function(data){
						console.log(data);
						$scope.candidateInfo = data;
					});
				}
			});
		}],
		link:["$scope",function(){		 
		}]
	};
});
dirObject.directive("studentsAll", function( ) {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: "app/partials/students.html",
		controller: ["$scope","candidateInfoService", function($scope, candidateInfoService) 
		             {
			candidateInfoService.getallCandidates().$promise.then(function(data){
				$scope.candidateList = data;
			});
		             }],
		             link:["$scope",function(){
		             }]
	};
});