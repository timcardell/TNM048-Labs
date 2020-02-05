/**
* @Created Jan 25, 2018
* @LastUpdate Jan 31, 2020
* @author Kahin Akram
*/

function kmeans(data, k) {
  //Crap we need'
  var iterations = 0;
  var maxLoops = 5;
  var iterations = 0;
  var qualityChange = 0;
  var oldqualitycheck = 0;
  var qualitycheck = 10000;
  var converge = false;

  //Parse the data from strings to floats
  var new_array = parseData(data);
  //Task 4.1 - Select random k centroids
  var centroid = initCentroids(new_array,k);

  //Prepare the array for different cluster indices
  var clusterIndexPerPoint = new Array(new_array.length).fill(0);

  //Task 4.2 - Assign each point to the closest mean.
  clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);
  //Master loop -- Loop until quality is good

  do {
    // //Task 4.3 - Compute mean of each cluster

    centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);
    // // assign each point to the closest mean.
    var clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);
    // //Task 4.4 - Do a quality check for current result
    oldqualitycheck = qualitycheck;
    qualitycheck = qualityCheck(centroid,new_array,clusterIndexPerPoint);
    //End the loop if...'
    qualityChange = Math.abs(oldqualitycheck - qualitycheck);
    iterations += 1;
    if(qualityChange < 0.000000001 || iterations >= maxLoops){
      converge = true;
    }

  }
  while(converge== false || iterations < 5)
  //Return results
  console.log(iterations)
  return {

    assignments: clusterIndexPerPoint
  };

}

/**
* Parse data from strings to floats
* Loop over data length
loop over every i in data
Fill array with parsed values, use parseFloat
* @param {*} data
* @return {array}
*/
function parseData(data){
  var array = [];

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];


    var newArr = [
      parseFloat(obj.A),
      parseFloat(obj.B),
      parseFloat(obj.C),
      parseFloat(obj.D),
      parseFloat(obj.E)

    ]
    array.push(newArr);
  }

  return array;
}

/**
* Task 4.1 - Randomly place K points
* Loop over data and Use floor and random in Math
* @return {array} centroid
*/

function initCentroids(data, k){
  //Create k centroids
  var centroid = [];
  for(var i = 0; i < k; i++){
    centroid.push( data[Math.floor(Math.random()*(data.length))]);
  }
  return centroid;

}

/**
* Taks 4.2 - Assign each item to the cluster that has the closest centroid
* Loop over points and fill array, use findClosestMeanIndex(points[i],means)
* Return an array of closest mean index for each point.
* @param points
* @param means
* @return {Array}
*/
function assignPointsToMeans(points, means){
  var assignments = [];
  for(var j = 0; j < points.length; j++){
    assignments.push(findClosestMeanIndex(points[j], means));
  }

  return assignments;
};
/**
* Calculate the distance to each mean, then return the index of the closest.
* Loop over menas and fill distance array, use euclideanDistance(point,means[i])
* return closest cluster use findIndexOfMinimum,
* @param point
* @param means
* @return {Number}
*/
function findClosestMeanIndex(point, means){
  var distances = [];
  for(var i = 0; i < means.length; i++){
    distances.push(euclideanDistance(point, means[i]));
  }
  return findIndexOfMinimum(distances);
};
/**
* Euclidean distance between two points in arbitrary dimension(column/axis)
* @param {*} point1
* @param {*} point2
* @return {Number}
*/

function euclideanDistance(point1, point2){
  if (point1.length != point2.length)
  throw ("point1 and point2 must be of same dimension");

  var sum = 0;

  for(var i = 0; i < point1.length; i++){
    sum = Math.abs(point1[i] - point2[i]) * Math.abs(point1[i] - point2[i]);
  }
  sum = Math.sqrt(sum);

  return sum;

};

/**
* Return the index of the smallest value in the array.
*  Loop over the array and find index of minimum
* @param array
* @return {Number}
*/
function findIndexOfMinimum(array){

  var index = 0;
  var min = array[0];

  for(var i = 1; i < array.length; i++){
    if(min > array[i]){
      min = array[i];
      index = i;
    }
  }
  console.log(index);
  return index;
};

/**
* //Task 4.3 - Compute mean of each cluster
* For each cluster loop over assignment and check if ass. equal to cluster index
* if true fill array
* then if array is not empty fill newMeans, use averagePosition(array)
* @param {*} points
* @param {*} assignments
* @param {*} k
* @returns {array}
*/
function computeClusterMeans(points, assignments, k){

  if (points.length != assignments.length)
  throw ("points and assignments arrays must be of same dimension");
  // for each cluster
  var newMeans = [];

  for(var j = 0; j < k; j++){
    var temp = [];
    for(var i = 0; i < assignments.length; i++){
      if(assignments[i] == j){
        temp.push(points[i]);
      }
    }
    if(temp.length > 0){
      newMeans.push(averagePosition(temp)) ;
    }
  }
  return newMeans;

};

/**
* Calculate quality of the results
* For each centroid loop new_array and check if clusterIndexPerPoint equal clsuter
* if true loop over centriod and calculate qualitycheck.
* @param {*} centroid
* @param {*} new_array
* @param {*} clusterIndexPerPoint
*/
function qualityCheck(centroid, new_array, clusterIndexPerPoint){
  var qualityCheck = 0;

  for(var j = 0; j < centroid.length; j++){
    for(var i = 0; i < new_array.length; i++){
      if(clusterIndexPerPoint[i] == j){
        qualityCheck += Math.pow(euclideanDistance(new_array[i],centroid[j]),2);
      }
    }
  }
  return qualityCheck;
}

/**
* Calculate average of points
* @param {*} points
* @return {number}
*/
function averagePosition(points){

  var sums = points[0];
  for (var i = 1; i < points.length; i++){
    var point = points[i];
    for (var j = 0; j < point.length; j++){
      sums[j] += point[j];
    }
  }

  for (var k = 0; k < sums.length; k++)
  sums[k] /= points.length;

  return sums;
};
