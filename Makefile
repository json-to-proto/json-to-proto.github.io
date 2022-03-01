build:
	npm i
	npm run build

webpack:
	npm run build
	# time --format="webpack took %E" npm run build

esbuild:
	npm run esbuild
	#time --format="esbuild took %E" npm run esbuild

browse:
	browse index.html