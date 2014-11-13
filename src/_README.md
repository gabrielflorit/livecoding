# [livecoding](http://gabrielflorit.github.io/livecoding/)

This is a complete rewrite of the old [livecoding.io](https://github.com/gabrielflorit/livecoding/tree/master), which was a complete rewrite of the old [water](https://github.com/gabrielflorit/water).

See [here](http://gabrielflorit.github.io/livecoding/docs/Livecoding.html) for documentation.

## Roadmap
<% _.chain(enhancements)
	.filter(function(v) {
		return v.closed_at;
	})
	.sortBy(function(v) {
		return new Date(v.closed_at);
	})
	.forEach(function(v) {
		var date = new Date(v.closed_at); %>
- ✓ <%=(date.getMonth() + 1)%>-<%=date.getDate()%>-<%=date.getFullYear()%>: [<%=v.title%>](https://github.com/gabrielflorit/livecoding/issues/<%=v.number%>)
<%	});

_.chain(enhancements)
	.reject(function(v) {
		return v.closed_at;
	})
	.sortBy(function(v) {
		return v.number;
	})
	.forEach(function(v) { %>
- [<%=v.title%>](https://github.com/gabrielflorit/livecoding/issues/<%=v.number%>)
<%	}); %>

## License

MIT © [Gabriel Florit](http://gabrielflorit.github.io/)