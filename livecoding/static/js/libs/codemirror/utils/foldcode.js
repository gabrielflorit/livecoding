CodeMirror.braceRangeFinder = function(cm, line) {
  var a,b,c,d=[];
  line == null ? (a=0,b=cm.lineCount(),c=0) : (a=line,b=a+1,c=1);
  for(a; a<b; a++){line=a;
	  var lineText = cm.getLine(line);
	  if(lineText.lastIndexOf("{") != undefined && lineText.lastIndexOf("{") !== -1){
	 	 var startChar = lineText.lastIndexOf("{");
	  }else{
		  continue;
	  }
	  if (startChar < 0 || lineText.lastIndexOf("}") > startChar){if(c===0){continue;}else{return;}}
	  var tokenType = cm.getTokenAt({line: line, ch: startChar}).className;
	  var count = 1, lastLine = cm.lineCount(), end, i;
	  outer: for (i = line + 1; i < lastLine; ++i) {
		var text = cm.getLine(i), pos = 0;
		for (;;) {
		  var nextOpen = text.indexOf("{", pos), nextClose = text.indexOf("}", pos);
		  if (nextOpen < 0) nextOpen = text.length;
		  if (nextClose < 0) nextClose = text.length;
		  pos = Math.min(nextOpen, nextClose);
		  if (pos == text.length) break;
		  if (cm.getTokenAt({line: i, ch: pos + 1}).className == tokenType) {
			if (pos == nextOpen) ++count;
			else if (!--count) { end = i; break outer; }
		  }
		  ++pos;
		}
	  }
	  if(c===1){
	  	if (end == null || end == line + 1)return;
	    return end;
	  }else{
		if (end == null || end == line + 1) continue;
		d.push(line);
	  }
  }
  return c===0?d:end;
};


CodeMirror.newFoldFunction = function(rangeFinder, markTextFolded, markTextUnFolded) {
  var folded = [];
  if (markTextFolded == null) markTextFolded = '%N% <span style="color:#600">&#x25b6;</span>';
  if (markTextUnFolded == null) markTextUnFolded = '%N% <span style="color:#600">&#x25bc;</span>';
  var markTextFill = '%N%&nbsp;&nbsp;';

  function isFolded(cm, n) {
    for (var i = 0; i < folded.length; ++i) {
      var start = cm.lineInfo(folded[i].start);
      if (!start) folded.splice(i--, 1);
      else if (start.line == n) return {pos: i, start: start.line, end: start.line + folded[i].size};
    }
  }

  return function(cm, line) { 
    cm.operation(function() {
      var known = isFolded(cm, line);
      if (known) {
        folded.splice(known.pos, 1);
        cm.clearMarker(known.start);
		// cm.setMarker(known.start, markTextUnFolded);
        var stack = [],i;
        for (i = known.start; i < known.end; ++i) {
          if (!stack.length) cm.showLine(i);
          if (i == stack[0]) stack.shift();
          var overlap = isFolded(cm, i);
          if (overlap) stack.unshift(overlap.end - 1);
        }
      } else {
	  	if(line===undefined){
			var ln = rangeFinder(cm),u,v;
			for(u=0; u<ln.length; u++){
				if(cm.lineInfo(ln[u]).markerText !== markTextFolded) {
					// cm.setMarker(ln[u], markTextUnFolded);
					cm.setMarker(ln[u]);
				}
			}
			for(v=0; v<cm.lineCount(); v++){
				if(cm.lineInfo(v).markerText == null) {
					// cm.setMarker(v, markTextFill);
					cm.setMarker(v, '%N%');
				}
			}
	    }else{
          var end = rangeFinder(cm, line);
          if (end == null) return;
          for (var i = line + 1; i < end; ++i) cm.hideLine(i);
          // var first = cm.setMarker(line, markTextFolded);
          var first = cm.setMarker(line, '%N%', 'codeFolded');
          folded.push({start: first, size: end - line});
	    }
      }
    });
  };
};
