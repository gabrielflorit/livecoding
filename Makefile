deploy: doc

	gulp --prod

doc:

	mkdir .doc;
	cp src/js/components/*.jsx .doc;
	grep -l '\t' .doc/*.jsx | xargs sed -i "" 's/	/   /g';
	docco -o docs -e .js .doc/*.jsx;
	rm -rf .doc;
