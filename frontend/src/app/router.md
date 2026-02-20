### Description

merupakan konfigurasi routing ReactRouter v6.4+ (Data Router)

- lazy-load setiap halaman
- QueryClient injection ke loader & action
- memisahkan area public, auth, dan admin

```js
const convert = (queryClient: QueryClient) => (m: any) => {
```

merupakan high order function + currying -> jadi setelah import selesai akan mengembalikan RouteModule, dan RouteModule membutuhkan queryClient, untuk dipasang di clientLoader & clientAction

```js
createAppRouter;
```

merupaan router yang dikonsturktsi saat app boot
- path: merupakan dynamic path dari parent component kalau ada
- lazy(): akan ngeload page saat kita mengakses url nya

### useMemo()
useMemo digunakan disini agar router tidak dibuat ulang setiap render, karena react selalu re-execute functino component setiap render
