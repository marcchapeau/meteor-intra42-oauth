Template.configureLoginServiceDialogForIntra42.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForIntra42.fields = function () {
  return [
    {property: 'clientId', label: 'Client uid'},
    {property: 'secret', label: 'Client secret'}
  ];
};