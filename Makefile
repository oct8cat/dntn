install:
	cd client && npm i && npm run build
	cd server && npm i
	cp -R client/dist server/public

uninstall:
	rm -rf server/node_modules client/node_modules

start:
	cd server && npm start

clean:
	rm -rf server/public client/dist
