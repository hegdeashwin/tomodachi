var dirObject = angular.module("myapp.directives", []);
dirObject.directive("examForm", function() {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			exams: "=?"
		},
/*
		templateUrl: "app/partials/exam_form.html",
		controller: ["$scope", "$routeParams", "$filter",'_', 'examService', '$window',function($scope, $routeParams,$filter,  _, examService,$window)
		             {	
			$scope.getExams = function(){
				$window.location.href = '#/exams';
			}
			$scope.examId = $routeParams.exam_id;
			if($scope.examId !== undefined )
			{
				console.log($scope.exam);
				$scope.selectedStudent = $scope.userid;
				$scope.selectedTemplate = $scope.template_id;
			}
			else
*/
	    templateUrl: "app/partials/exam_form.html",
	    controller: ["$scope", "$routeParams", "$filter", "_", 'examService', '$window',function($scope, $routeParams,$filter,  _, examService,$window)
	    {	
	    	$scope.getExams = function(){
				$window.location.href = '#/exam';
			}
	    	$scope.examId = $routeParams.exam_id;
	    	if($scope.examId !== undefined )
	    	{
	    		/*console.log($scope.exams);*/
	    		//$scope.exam = _.find($scope.exams, {set_exam_id: parseInt($scope.examId)});
	    		console.log($scope.exam);
	    		
	    		$scope.selectedStudent = $scope.userid;
	    		$scope.selectedTemplate = $scope.template_id;
	    	}
	    	else
	    	{
	    		$scope.students=examService.getStudents(function(){
	    			//get students here...
	    		});
	    		
	    		$scope.templates=examService.getTemplates(function(){
	    			//get templates here...
	    		});
	    		
	    		$scope.setExam=function(){
	    			$scope.exam.start_date = $filter('date')($scope.exam.start_date, "MM/dd/yyyy");
	    			$scope.exam.start_time = $filter('date')($scope.exam.start_time, "HH:mm:ss");
	    			$scope.exam.template_id = parseInt($scope.exam.template_id);
	    			$scope.exam.templatesetexam = _.findWhere($scope.templates, function(template){	    				
	    				return template.template_id = $scope.exam.template_id;
	    			});
	    			$scope.exam.userid = parseInt($scope.exam.userid);
	    			$scope.exam.user = _.findWhere($scope.students, function(student){	    				
	    				return student.userid = $scope.exam.userid;
	    			});
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
			controller:["$scope", "examService", function($scope, examService)

			{
				$scope.setexams=examService.getallExam(function(){
					//getting all exams here...
				});
			}],
		             link: ["$scope",  function($scope){
		             }]
	};
}).directive("startExam", function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'app/partials/startexam.html',
		controller: ["$scope","$window", function($scope,$window) {
			$scope.again=function(){
				$window.location.href = 'candidate.html';
			}				
		}],
		link: function(scope, elem, attrs) {
			scope.startTime = false;
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
				scope.isOptionSelected=true;
				scope.startTime = true;
			};
			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.isOptionSelected=true;
				} 
				else {
					scope.quizOver=true;
					scope.startTime = false;
				}
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
		}
	}
}).factory('quizFactory', function() {
	var questions = [
	                 {
	                	 question: "Which is the largest country in the world by population?",
	                	 options: ["India", "USA", "China", "Russia"],
	                 },
	                 {
	                	 question: "When did the second world war end?",
	                	 options: ["1945", "1939", "1944", "1942"],
	                 },
	                 {
	                	 question: "Which was the first country to issue paper currency?",
	                	 options: ["USA", "France", "Italy", "China"],
	                 },
	                 {
	                	 question: "Which city hosted the 1996 Summer Olympics?",
	                	 options: ["Atlanta", "Sydney", "Athens", "Beijing"],
	                 },
	                 {	
	                	 question: "Who invented telephone?",
	                	 options: ["Albert Einstein", "Alexander Graham Bell", "Isaac Newton", "Marie Curie"],
	                 }
	                 ];
	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else 
			{
				return false;
			}
		}
	};
});


dirObject.directive("studentInfo", function() {
	return {
		restrict: 'EA',
		transclude: true,
		templateUrl: "app/partials/studentinfo.html",
		controller: ["$scope","candidateInfoService","$routeParams", function($scope, candidateInfoService, $routeParams)  {
			alert($routeParams.id)  ;
			candidateInfoService.getCandidateInfo({id : $routeParams.id}).$promise.then(function(data){
				console.log(data);
				$scope.candidateInfo = data;
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
