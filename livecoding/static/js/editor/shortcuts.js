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
						{ shortcut: 'Ctrl',      name: 'slider'                 },
						{ shortcut: 'Ctrl + S',  name: 'save document'          },
						{ shortcut: 'Ctrl + /',  name: 'comment selection'      },
						{ shortcut: "Ctrl + .",  name: 'uncomment selection'    },
						{ shortcut: "Ctrl + \\", name: 'pause/resume execution' },
						{ shortcut: "Ctrl + 7",  name: 'start animation'        },
						{ shortcut: "Ctrl + 8",  name: 'stop animation'         }
					]
				},
				{
					section: 'modes', shortcuts: [
						{ shortcut: 'Ctrl + 1', name: 'html'       },
						{ shortcut: 'Ctrl + 2', name: 'javascript' },
						{ shortcut: 'Ctrl + 3', name: 'css'        },
						{ shortcut: 'Ctrl + 4', name: 'json'       }
					]
				},
				{
					section: 'layouts', shortcuts: [
						{ shortcut: "Ctrl + '", name: 'next layout'     },
						{ shortcut: 'Ctrl + ;', name: 'previous layout' }
					]
				}
			];
		break;
	}

	return shortcuts;

};