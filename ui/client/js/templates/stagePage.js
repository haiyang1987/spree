

Template.stagePage.helpers({
  setTitle: function(data) {
    document.title = "Stage " + data.stageId + " (" + data.attemptId + ")";
    return null;
  }
});

Template.exceptionFailure.helpers({
  exceptionFailure: function(reason) {
    return reason == "ExceptionFailure"
  }
});
Template.fetchFailure.helpers({
  fetchFailure: function(reason) {
    return reason == "FetchFailure"
  }
});

getHostPort = function(execId) {
  var e = Executors.findOne({ id: execId });
  if (e) {
    return e.host + ':' + e.port;
  }
  return null;
};

Template.executorLostFailure.helpers({
  executorLostFailure: function(reason) {
    return reason == "ExecutorLostFailure"
  },
  getHostPort: getHostPort
});

Template.summaryMetricsTable.helpers({
  numCompletedTasks: function(taskCounts) {
    return taskCounts && ((taskCounts.succeeded || 0) + (taskCounts.failed || 0));
  }
});


// Per-executor table
var executorColumns = [
  { id: 'id', label: 'Executor ID', sortBy: 'id', template: 'id' },
  { id: 'address', label: 'Address', sortBy: getHostPort },
  taskTimeColumn
]
      .concat(taskColumns)
      .concat(ioColumns);

makeTable(
      executorColumns, 'executorTable', 'sorted', 'columns', 'stageExec', 'stageExec', 'executors', ['id', 1]
);


// Per-task table
var columns = [
  { id: 'index', label: 'Index', sortBy: 'index' },
  { id: 'id', label: 'ID', sortBy: 'id', template: 'id' },
  { id: 'attempt', label: 'Attempt', sortBy: 'attempt' },
  { id: 'status', label: 'Status', sortBy: 'status' },
  { id: 'localityLevel', label: 'Locality Level', sortBy: 'locality' },
  { id: 'execId', label: 'Executor', sortBy: 'execId' },
  { id: 'host', label: 'Host', sortBy: 'host', template: 'host' },
  startColumn,
  durationColumn,
  { id: 'gcTime', label: 'GC Time', sortBy: 'metrics.JVMGCTime' }
]
      .concat(ioColumns)
      .concat([
        { id: 'errors', label: 'Errors', sortBy: 'errors' }
      ]);

makeTable(
      columns, 'tasksTable', 'sorted', 'columns', 'taskRow', 'task', 'taskAttempts', ['id', 1]
);

Template['taskRow-status'].helpers({
  status: function(task) {
    return statuses[task.status];
  }
});
