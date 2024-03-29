/***
|Description|highlights saving button (bold red by default) and the document title (adds a leading "*") when there are unsaved changes (also toggles {{{hasUnsavedChanges}}} class of the root element for hackability)|
|Version    |1.5.1|
|Author     |Yakov Litvin|
|Source     |https://github.com/YakovL/TiddlyWiki_ShowUnsavedPlugin/blob/master/ShowUnsavedPlugin.js|
|License    |[[MIT|https://github.com/YakovL/TiddlyWiki_YL_ExtensionsCollection/blob/master/Common%20License%20(MIT)]]|
<<option chkShowDirtyStory>> show unsaved if any tiddler is opened for editing
Styles applied to unsaved TW can be adjusted in StyleSheetUnsaved
***/
//{{{
config.macros.showDirtyPlugin = {
	// styles that highlight save button when there's something to save
	showDirtyCss: ".saveChangesButton { font-weight: bold; color: red !important; }",
	styleSheetName: "suggestSavingOnDirty",
	containerClassName: "hasUnsavedChanges",
	showDrity: function(dirty) {
		const css = store.getTiddlerText('StyleSheetUnsaved')
		if(dirty) {
			jQuery('html').addClass(this.containerClassName)
			setStylesheet(css, this.styleSheetName)
			document.title = "*" + getPageTitle()
		} else {
			jQuery('html').removeClass(this.containerClassName)
			removeStyleSheet(this.styleSheetName)
			document.title = getPageTitle()
		}
	},
	checkDirty: function() {
		return store.isDirty() ||
			(config.options.chkShowDirtyStory && story.areAnyDirty())
	},
	init: function() {
		config.shadowTiddlers.StyleSheetUnsaved = this.showDirtyCss

		// add the "saveChangesButton" class to the save changes button
		config.macros.saveChanges.SCM_orig_handler = config.macros.saveChanges.handler
		config.macros.saveChanges.handler = function(place, macroName, params) {
			this.SCM_orig_handler.apply(this, arguments)
			place.lastChild.classList.add("saveChangesButton")
		}

		// regularly check and indicate unsaved
		setInterval(function() {
			const isDirty = config.macros.showDirtyPlugin.checkDirty()
			config.macros.showDirtyPlugin.showDrity(isDirty)
		}, 500)
	}
}
//}}}