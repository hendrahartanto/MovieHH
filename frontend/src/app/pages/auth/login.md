## searchParams.get("redirectTo");

membaca query param "redirectTo" dari URL sekarang:
contoh: /auth/login?redirectTo=/app/profile
maka akan dapat value: /app/profile

## saat login berhasil maka:

akan redirect balik ke page sebelum user mengakses login page
kalau redirectTo nya kosong maka akan balik ke dashboard utama
notes:

- replace: true
  Artinya mengganti entry di history browser (tidak menambah halaman baru di history). Berguna agar user tidak bisa klik “Back” untuk kembali ke halaman login.
