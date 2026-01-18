## deskripsi umum

paths: digunakan sebagai penampung seluruh path yang ada di web ini

setiap path memiliki:

- path
  - digunakan untuk mendefinisikan path saat buat router
  - merepresentasikan path lokal yang relatif terhadap induknya
  - isinya static
- getHref()
  - mereturn URL lengkap dan sifatya dinamis bisa setup query atau route params, serperti redirectTo atau id
  - membentuk URL absolut yang bisa digunakan oleh (href, redirect, dsb).

## fungsi encodeURIComponent di getHref register dan login

`encodeURIComponent` digunakan untuk men-encode parameter yang disisipkan ke dalam URL agar aman. Misalnya:
tanpa encoding:
"/auth/login?redirectTo=/app/dashboard?tab=profile"
(Berpotensi rusak karena simbol `?` dan `=`)

## kegunaan query param redirectTo

useCase:

- login: digunakan untuk balik ke page sebelum saat kita akses login page
  misalnya saat logout maka akan redirect ke login page, tapi saat mau akses login page akan diberi argumen lokasi pathname sekarang sebelum ke login page
  contoh:
  const logout = useLogout({
  onSuccess: () => navigate(paths.auth.login.getHref(location.pathname)),
  });
