## deskripsi umum

code ini membuat instance Axios dengan konfigurasi default untuk project berbasis Vite, dan menambahkan interceptor untuk menghandle request dan response

## 🔍 Apa itu Interceptor di Axios?

Interceptor di Axios adalah fungsi yang berjalan secara otomatis sebelum atau sesudah request/response dikirim/diterima.

## interceptor response

- jika response success maka akan langsung return response.data
- jadi mempershingkat di tempat pemanggil, ga perlu lagi pakai res.data lagi

## interceptor error

- jika unauthorize 401, maka artinya antara access tokennya masih null atau udah expired, maka akan mencoba mengambil access token baru dengan memanggil api refresh, saal proses pengambilan token baru tersebut, request" sebelumnya yang menumpuk akan ditampung di failedQueue, karena isRefreshingnya = true (kondisi tersebut bisa terjadi karena misalnya mengakses 1 page bisa banyak api yang dipanggil). jika sudah berhasil mendapatkan token baru maka akan resolve queueunya menggunakan token baru, atau reject kalau error.
  lalu timpa token sekarang dengan token baru
- jika unauthorized 401 dan sudah diretry, artinya tetap gagal saat mencoba mengakses refresh token berarti sessionnya expired. maka akan redirect ke login page dengan argument pathname sekarang, agar jika login success akan balik lagi ke page sekarang

error handling dengan Promise.reject(error) agar (try/catch atau .catch()) bisa menangani error tersebut jika perluk

## apa yang terjadi saat return api(originalRequest)

interceptor akan memanggil ulang request yang gagal, tapi kali ini dengan Authorization: Bearer <newAccessToken> yang sudah disetel sebelumnya

## bentuk raw response axios

```ts
{
  config: {...},
  data: {
    message: "Login Success",
    data: {...}
  },
  headers: {...},
  request: XMLHttpRequest,
  status: 200,
  statusText: "OK"
}
```

makanya di interceptor response langsung mengakses response.data nya
