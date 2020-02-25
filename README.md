# Установка

```
git clone git@github.com:oct8cat/dntn
cd dntn
make install
```

# Запуск

```
DB_URL=mongodb://localhost:27017/dntn make start
```

`DB_URL` - опционален. Можно указать свой, можно вовсе не указывать, написав просто `make start` - тогда будет использован дефолтный из примера. После запуска открыть http://localhost:3000.
