import Ember from "ember";

const { computed } = Ember;

export default Ember.Controller.extend({
  appController: Ember.inject.controller('application'),

  tableOfContents: [
    { section: "Getting Started" },
    { route: "docs.introduction", title: "Introduction"},
    { route: "docs.installation", title: "Installation"},
    { route: "docs.writing-tasks", title: "Your First Task"},

    { section: "Tutorial" },
    { route: "docs.tutorial", title: "Use Case: Loading Data"},

    { section: "Reference" },
    { route: "docs.task-function-syntax", title: "Task Function Syntax"},
    { route: "docs.task-concurrency", title: "Managing Task Concurrency",
      children: [
        { route: "docs.task-concurrency-advanced", title: "Advanced"},
      ]
    },
    { route: "docs.cancelation", title: "Cancelation", },
    { route: "docs.error-vs-cancelation", title: "Handling Errors"},
    { route: "docs.child-tasks", title: "Child Tasks"},
    { route: "docs.task-groups", title: "Task Groups"},
    { route: "docs.derived-state", title: "Derived State" },
    { route: "docs.events", title: "Ember / jQuery Events" },
    { route: "docs.testing-debugging", title: "Testing & Debugging"},
    { route: "docs.faq", title: "FAQ & Fact Sheet"},

    { section: "Examples" },
    { route: "docs.examples.loading-ui", title: "Loading UI" },
    { route: "docs.examples.autocomplete", title: "Type-Ahead Search" },
    { route: "docs.examples.increment-buttons", title: "Accelerating Increment Buttons" },
    { route: "docs.examples.ajax-throttling", title: "AJAX Throttling" },
    { route: "docs.examples.route-tasks", title: "Route Tasks" },
    { route: "docs.examples.joining-tasks", title: "Awaiting Multiple Child Tasks" },
  ],

  flatContents: computed(function(){
    var flattened = [];
    this.get('tableOfContents').forEach(function(entry) {
      flattened.push(entry);
      if (entry.children){
        flattened = flattened.concat(entry.children);
      }
    });
    return flattened;
  }),

  currentIndex: computed('appController.currentRouteName', 'flatContents', function(){
    var contents = this.get('flatContents'),
        current = this.get('appController.currentRouteName'),
        bestMatch,
        entry;

    for (var i=0; i<contents.length; i++) {
      entry = contents[i];
      if (entry.route && new RegExp('^' + entry.route.replace(/\./g, '\\.')).test(current)) {
        if (typeof(bestMatch) === 'undefined' || contents[bestMatch].route.length < entry.route.length) {
          bestMatch = i;
        }
      }
    }
    return bestMatch;
  }),

  nextTopic: computed('currentIndex', 'flatContents', function(){
    return this.findNext(+1);
  }),

  prevTopic: computed('currentIndex', 'flatContents', function(){
    return this.findNext(-1);
  }),

  findNext(inc) {
    let currentIndex = this.get('currentIndex');
    if (typeof(currentIndex) === "undefined") { return; }

    let contents = this.get('flatContents');
    for (let i = currentIndex + inc; i >= 0 && i < contents.length; i += inc) {
      let value = contents[i];
      if (value.route) {
        return value;
      }
    }
  },
});
