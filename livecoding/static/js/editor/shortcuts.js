var lc = lc || {}; 
lc.getShortcuts = function(os) {

	var shortcuts = [
		{
			section: 'general', shortcuts: [
				{ shortcut: os == 'Mac' ? 'Alt'     : (os == 'Linux' ? 'Ctrl'      : 'Ctrl'     ), name: 'slider'                 },
				{ shortcut: os == 'Mac' ? 'Alt + S' : (os == 'Linux' ? 'Ctrl + S'  : 'Ctrl + S' ), name: 'save document'          },
				{ shortcut: os == 'Mac' ? '⌘ + /'  : (os == 'Linux' ? 'Ctrl + /'  : 'Ctrl + /' ), name: 'comment selection'      },
				{ shortcut: os == 'Mac' ? "⌘ + ."  : (os == 'Linux' ? "Ctrl + ."  : "Ctrl + ." ), name: 'uncomment selection'    },
				{ shortcut: os == 'Mac' ? "⌘ + \\" : (os == 'Linux' ? "Ctrl + \\" : "Ctrl + \\"), name: 'pause/resume execution' },
				{ shortcut: os == 'Mac' ? "⌘ + 9"  : (os == 'Linux' ? "Ctrl + 7"  : "Ctrl + 7" ), name: 'start animation'        },
				{ shortcut: os == 'Mac' ? "⌘ + 0"  : (os == 'Linux' ? "Ctrl + 8"  : "Ctrl + 8" ), name: 'stop animation'         }
			]
		},
		{
			section: 'modes', shortcuts: [
				{ shortcut: os == 'Mac' ? '⌘ + 1' : (os == 'Linux' ? 'Ctrl + 1' : 'Ctrl + 1'), name: 'html'       },
				{ shortcut: os == 'Mac' ? '⌘ + 2' : (os == 'Linux' ? 'Ctrl + 2' : 'Ctrl + 2'), name: 'javascript' },
				{ shortcut: os == 'Mac' ? '⌘ + 3' : (os == 'Linux' ? 'Ctrl + 3' : 'Ctrl + 3'), name: 'css'        },
				{ shortcut: os == 'Mac' ? '⌘ + 4' : (os == 'Linux' ? 'Ctrl + 4' : 'Ctrl + 4'), name: 'json'       }
			]
		},
		{
			section: 'layouts', shortcuts: [
				{ shortcut: os == 'Mac' ? "⌘ + '" : (os == 'Linux' ? "Ctrl + '" : "Ctrl + '"), name: 'next layout'     },
				{ shortcut: os == 'Mac' ? '⌘ + ;' : (os == 'Linux' ? 'Ctrl + ;' : 'Ctrl + ;'), name: 'previous layout' }
			]
		}
	];

	return shortcuts;

};