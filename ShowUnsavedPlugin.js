/***
|Description|highlights saving button (bold red by default) and the document title (adds a leading "*") when there are unsaved changes|
|Version|1.4|
|Author|Yakov Litvin|
|Source|https://github.com/YakovL/TiddlyWiki_ShowUnsavedPlugin/blob/master/ShowUnsavedPlugin.js|
|License|[[MIT|https://github.com/YakovL/TiddlyWiki_ShowUnsavedPlugin/blob/master/LICENSE]]|
<<option chkShowDirtyStory>> show unsaved if any tiddler is opened for editing
Styles applied to unsaved TW can be adjusted in StyleSheetUnsaved
***/
//{{{
config.macros.showDirtyPlugin = {
	// styles that highlight save button when there's something to save
	showDirtyCss: ".saveChangesButton { font-weight: bold; color: red !important; }",
	styleSheetName: "suggestSavingOnDirty",
	showDrity: function(dirty) {
		const css = store.getTiddlerText('StyleSheetUnsaved');
		if(dirty) {
			setStylesheet(css, this.styleSheetName);
			if(document.title[0] != "*")
				document.title = "*" + document.title;
		} else {
			removeStyleSheet(this.styleSheetName);
			if(document.title[0] == "*")
				document.title = document.title.substr(1);
		}
	},
	checkDirty: function() {
		return store.isDirty() ||
			(config.options.chkShowDirtyStory && story.areAnyDirty());
	},
	init: function() {
		config.shadowTiddlers.StyleSheetUnsaved = this.showDirtyCss;

		// add the "saveChangesButton" class to the save changes button
		config.macros.saveChanges.SCM_orig_handler = config.macros.saveChanges.handler;
		config.macros.saveChanges.handler = function(place, macroName, params) {

			this.SCM_orig_handler.apply(this, arguments);
			place.lastChild.classList.add("saveChangesButton");
		};

		// regularly check and indicate unsaved
		setInterval(function() {
			const isDirty = config.macros.showDirtyPlugin.checkDirty();
			config.macros.showDirtyPlugin.showDrity(isDirty);
		}, 500);
	}
};
//}}}