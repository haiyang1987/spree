
function stageAttemptId(attempt) {
  return attempt && (attempt.stageId + '.' + attempt.id);
}

function stageAttemptUrl(attempt) {
  return [ '', 'a', attempt.appId, 'stage', attempt.stageId ].join('/') + (attempt.id ? ('?attempt=' + attempt.id) : '');
}

var stageIDColumn = new Column(
      'id',
      'Stage ID',
      'stageId',
      {
        render: (attempt) => {
          return <a href={stageAttemptUrl(attempt)}>{
            attempt.stageId + (attempt.id ? (" (" + attempt.id + ")") : "")
          }</a>;
        },
        renderKey: '',
        truthyZero: true
      }
);
var stageNameColumn = new Column(
      'desc',
      'Description',
      'name',
      {
        render: (attempt) => { return <a href={stageAttemptUrl(attempt)}>{attempt.name}</a>; },
        renderKey: ''
      }
);

Template.registerHelper('getStageData', () => {
  return StageCounts.findOne();
});

Template.stagesTables.helpers({
  showAll: function() {
    return Cookie.get('stages-showAll') != false;
  },
  columns: function() {
    return [
      stageIDColumn,
      stageNameColumn,
      startColumn,
      durationColumn,
      taskIdxsColumn,
      tasksColumn
    ].concat(ioColumns);
  }
});

function unsetShowAll() {
  Cookie.set("stages-showAll", false);
}

function setShowAll() {
  Cookie.set("stages-showAll", true);
}

Template.stagesTables.events({
  'click #active-link, click #succeeded-link, click #failed-link, click #pending-link, click #skipped-link': unsetShowAll,
  'click #all-link': setShowAll
});

Template.registerHelper("tableData", function(appId, objType, title, total, collection, titleId, columns, alwaysShow, extraArg) {
  return {
    title: title,
    titleId: titleId,
    total: total,
    name: objType,
    collection: collection,
    subscriptionFn: () => {
      return (opts) => {
        var findObj = { appId: appId };
        if (objType === 'stages' && extraArg !== null && extraArg !== undefined) {
          findObj.jobId = extraArg;
        }
        return Meteor.subscribe(titleId + "-" + objType, findObj, opts);
      };
    },
    show: total || (alwaysShow === true),
    columns: columns,
    keyFn: objType == 'stages' && (() => { return stageAttemptId; })
  };
});

