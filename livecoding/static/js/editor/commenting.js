var lc = lc || {}; 

lc.codemirrorUtil = {

	/*
		Helper function - gets called by the "comment" keyboard shortcut.

		@param {object} cm The CodeMirror instance.
	*/
	comment: function(cm) {
		cm.blockComment(cm.getCursor(true), cm.getCursor(false));
	},

	/*
		Helper function - gets called by the "uncomment" keyboard shortcut.

		@param {object} cm The CodeMirror instance.
	*/
	uncomment: function(cm) {
		cm.uncomment(cm.getCursor(true), cm.getCursor(false));
	}

};