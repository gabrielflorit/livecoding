var lc = lc || {}; 
lc.getShortcuts = function() {

	var shortcuts = [];

	switch(BrowserDetect.OS) {

		case 'Mac':
			shortcuts = [
				{
					section: 'general', shortcuts: [
						{ shortcut: 'Alt',     name: 'slider'                 },
						{ shortcut: 'Alt + S', name: 'save document'          },
						{ shortcut: '⌘ + /',  name: 'comment selection'      },
						{ shortcut: "⌘ + .",  name: 'uncomment selection'    },
						{ shortcut: "⌘ + \\", name: 'pause/resume execution' },
						{ shortcut: "⌘ + 9",  name: 'start animation'        },
						{ shortcut: "⌘ + 0",  name: 'stop animation'         }
					]
				},
				{
					section: 'modes', shortcuts: [
						{ shortcut: '⌘ + 1', name: 'html'       },
						{ shortcut: '⌘ + 2', name: 'javascript' },
						{ shortcut: '⌘ + 3', name: 'css'        },
						{ shortcut: '⌘ + 4', name: 'json'       }
					]
				},
				{
					section: 'layouts', shortcuts: [
						{ shortcut: "⌘ + '", name: 'next layout'     },
						{ shortcut: '⌘ + ;', name: 'previous layout' }
					]
				}
			];
		break;

		case 'Linux':
		break;

		// windows
		default:
			shortcuts = [
				{
					section: 'general', shortcuts: [
						{ shortcut: 'Ctrl',      name: 'slider'                 }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + S',  name: 'save document'          }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + /',  name: 'comment selection'      }, // OK IE 9 - CHROME - FF
						{ shortcut: "Ctrl + .",  name: 'uncomment selection'    },  // OK IE 9 - CHROME - FF
						{ shortcut: "Ctrl + \\", name: 'pause/resume execution' }
						// { shortcut: "⌘ + 9",  name: 'start animation'        },
						// { shortcut: "⌘ + 0",  name: 'stop animation'         }
					]
				},
				{
					section: 'modes', shortcuts: [
						{ shortcut: 'Ctrl + 1', name: 'html'       }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + 2', name: 'javascript' }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + 3', name: 'css'        }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + 4', name: 'json'       }  // OK IE 9 - CHROME - FF
					]
				},
				{
					section: 'layouts', shortcuts: [
						{ shortcut: "Ctrl + '", name: 'next layout'     }, // OK IE 9 - CHROME - FF
						{ shortcut: 'Ctrl + ;', name: 'previous layout' }  // OK IE 9 - CHROME - FF
					]
				}
			];
		break;
	}

	return shortcuts;

};