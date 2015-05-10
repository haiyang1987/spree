
Jobs = new Mongo.Collection("jobs")
Stages = new Mongo.Collection("stages")
Tasks = new Mongo.Collection("tasks")

if (Meteor.isClient) {

  function formatTime(ms) {
    return ms + "ms";
  }

  Template.registerHelper("log", function(something) {
    console.log(something);
  });

  Template.registerHelper("formatDateTime", function(dt) {
    return moment(dt).format("YYYY/MM/DD HH:mm:ss");
  });

  Template.jobRows.helpers({
    jobs: function() {
      var jobs = Jobs.find();
      var stagesById = {}
      var stageIDs = []
      jobs.forEach(function(job) {
        stageIDs = stageIDs.concat(job.stageIDs);
      });
      console.log("fetching stages: %s", stageIDs.join(','));
      Stages.find({id: { '$in': stageIDs }}).map(function(stage) {
        if (!(stage.id in stagesById)) {
          stagesById[stage.id] = []
        }
        stagesById[stage.id].push(stage);
      });
      console.log("stagesById: %O", stagesById);
      var j = jobs.map(function(job) {
        return {
          id: job.id,
          time: job.time,
          finishTime: job.finishTime,
          succeeded: job.succeeded,
          stages: job.stageIDs.map(function (stageId) {
            var attempts = stagesById[stageId];
            return attempts ? attempts[attempts.length - 1] : [];
          })
        }
      });
      console.log("jobs: %O", j);
      window.jobs = j;
      return j;
    },

    getJobDuration: function(job) {
      return formatTime(job.finishTime - job.time);
    },

    getSucceededStages: function(job) {
      return job.stages.filter(function(stage) { return stage.completionTime && !stage.failureReason; }).length;
    },

    getSucceededTasks: function(job) {
      var s = 0;
      job.stages.forEach(function(stage) { s += stage.tasksSucceeded; });
      return s;
    },

    getStartedTasks: function(job) {
      var s = 0;
      job.stages.forEach(function(stage) { s += stage.tasksStarted; });
      return s;
    }
  });

}
