var lc = lc || {}; 

lc.codemirrorUtil = {

	/*
		Helper function - gets called by the "comment" keyboard shortcut.
		@param {object} cm The CodeMirror instance.
	*/
	comment: function(cm) {
		lc.codemirrorUtil.actualComment(cm, true);
	},

	/*
		Helper function - gets called by the "uncomment" keyboard shortcut.
		@param {object} cm The CodeMirror instance.
	*/
	uncomment: function(cm) {
		lc.codemirrorUtil.actualComment(cm, false);
	},

	/*
		Comment / uncomment the selected range in CodeMirror.
		@param {object} cm The CodeMirror instance.
		@param {boolean} comment Whether to comment or uncomment.
	*/
	actualComment: function(cm, comment) {
		cm.commentRange(comment, cm.getCursor(true), cm.getCursor(false));
	}

};